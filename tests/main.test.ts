// Importa o código que será testado
import '../src/main';

describe('Event listener for mouseup', () => {
    let originalAlert: jest.Mock;

    beforeAll(() => {
        // Substitui o alert por uma função mock para testar sem exibir alertas reais
        originalAlert = jest.fn();
        global.alert = originalAlert;
    });

    afterAll(() => {
        // Restaura o alert original após os testes
        global.alert = originalAlert;
    });

    beforeEach(() => {
        // Configura o ambiente do DOM antes de cada teste
        document.body.innerHTML = '<div id="test">Hello World</div>';
        (window.getSelection as jest.Mock) = jest.fn(() => ({
            toString: () => 'Hello World'
        }));
    });

    test('should alert the selected text', () => {
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        expect(global.alert).toHaveBeenCalledWith('Texto selecionado: Hello World');
    });

    test('should throw an error if no text is selected', () => {
        (window.getSelection as jest.Mock) = jest.fn(() => ({
            toString: () => undefined
        }));

        expect(() => {
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        }).toThrow('Ocorreu um erro ao destacar o texto selecionado.');
    });

    test('should not alert if no text is selected', () => {
        (window.getSelection as jest.Mock) = jest.fn(() => ({
            toString: () => ''
        }));

        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        expect(global.alert).not.toHaveBeenCalled();
    });
});
