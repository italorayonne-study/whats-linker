// src/Main.test.ts

import { Main } from '../src/main';

describe('Main', () => {
    let main: Main;
    let selectionMock: Partial<Selection>;

    beforeEach(() => {
        // Inicializa a instância de Main
        main = new Main();

        // Mock de window.getSelection para simular seleção de texto
        selectionMock = {
            toString: jest.fn().mockReturnValue('1234567890'),
            getRangeAt: jest.fn().mockReturnValue({
                getBoundingClientRect: jest.fn().mockReturnValue({
                    left: 100,
                    top: 100,
                    bottom: 150,
                    right: 150
                })
            }),
            removeAllRanges: jest.fn(),
        };

        // Simula o comportamento do DOM para obter a seleção
        jest.spyOn(window, 'getSelection').mockReturnValue(selectionMock as Selection);

        // Mock para createElement
        jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
            const element = document.createElementNS('http://www.w3.org/1999/xhtml', tagName);
            return element as HTMLElement;
        });

        // Mock de fetch para retornar conteúdo fictício de um popup HTML
        global.fetch = jest.fn(() =>
            Promise.resolve({
                text: () => Promise.resolve('<div><span id="select-number"></span><button id="chat-whats-linker"></button><button class="close"></button></div>')
            } as Response)
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should validate a 10-digit contact number', () => {
        expect(main.validateContactNumber('1234567890')).toBe(true);
    });

    it('should validate an 11-digit contact number', () => {
        expect(main.validateContactNumber('12345678901')).toBe(true);
    });

    it('should invalidate contact numbers with less than 10 digits', () => {
        expect(main.validateContactNumber('123456789')).toBe(false);
    });

    it('should invalidate contact numbers with more than 11 digits', () => {
        expect(main.validateContactNumber('123456789012')).toBe(false);
    });

    it('should format a 10-digit phone number', () => {
        expect(main.phoneMask('1234567890')).toBe('(12) 3456-7890');
    });

    it('should format an 11-digit phone number', () => {
        expect(main.phoneMask('12345678901')).toBe('(12) 34567-8901');
    });

    it('should create a popup with correct position and content', async () => {
        // Simulando a seleção de texto
        const rangeMock = selectionMock.getRangeAt!(0) as Range;

        // Chamar a função createPopup
        await main.createPopup('1234567890');

        // Verifica se o popup foi criado no local correto
        const popup = document.querySelector('.card') as HTMLElement;
        expect(popup).toBeTruthy();
        expect(popup?.style.left).toBe(`${rangeMock.getBoundingClientRect().left + window.scrollX}px`);
        expect(popup?.style.top).toBe(`${rangeMock.getBoundingClientRect().bottom + window.scrollY}px`);

        // Verifica se o conteúdo foi inserido corretamente
        const numberElement = popup?.querySelector('#select-number');
        expect(numberElement?.textContent).toBe('(12) 3456-7890');
    });

    it('should open WhatsApp Web with the correct phone number on chat button click', async () => {
        // Simula abrir nova aba
        const openMock = jest.spyOn(window, 'open').mockImplementation(() => null);

        // Chama createPopup e simula o clique no botão "Conversar"
        await main.createPopup('1234567890');
        const chatButton = document.querySelector('#chat-whats-linker');
        chatButton?.dispatchEvent(new Event('click'));

        expect(openMock).toHaveBeenCalledWith('https://web.whatsapp.com/send?phone=1234567890', '_blank');
    });

    it('should remove the popup when close button is clicked', async () => {
        // Chama createPopup
        await main.createPopup('1234567890');

        // Simula o clique no botão de fechar
        const closeButton = document.querySelector('.close');
        closeButton?.dispatchEvent(new Event('click'));

        const popup = document.querySelector('.card');
        expect(popup).toBeNull(); // Verifica se o popup foi removido
    });
});
