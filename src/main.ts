class Main {

    constructor() {
        this.getSelectionValue()
    }

    handleSelectedValue(value: string): void {
        if (this.validateContactNumber(value)) {
            this.createPopup()
        }
    }

    getSelectionValue(): void {
        document.addEventListener('mouseup', () => {
            const highlightedValue: string | undefined = window.getSelection()?.toString().trim();

            if (!highlightedValue) return

            this.handleSelectedValue(highlightedValue)
        })
    }

    /**
     * 
     * @param value Número de contato a ser validado.
     * @returns {boolean} Retorna true se for válido, false caso contrário.
     */
    validateContactNumber(value: string): boolean {
        const clearValue = value?.replace(/\D/g, '').trim() || '';

        return clearValue.length > 6;
    }


    async createPopup(): Promise<void> {
        const selection = window.getSelection();

        if (!selection || selection.isCollapsed) return; // Verifica se há texto selecionado.

        const range = selection.getRangeAt(0);
        const clientRect = range.getBoundingClientRect();

        const popup = document.createElement('div');
        popup.classList.add('custom-popup');

        // Define a posição do popup de acordo com a posição do texto selecionado
        popup.style.left = `${clientRect.left + window.scrollX}px`;
        popup.style.top = `${clientRect.bottom + window.scrollY}px`;

        // Cria o botão de fechar
        const closeButton = document.createElement('button');
        closeButton.classList.add('close-btn');
        closeButton.innerHTML = '&times;'; // Símbolo de "x"
        closeButton.onclick = () => document.body.removeChild(popup);

        // Carrega o conteúdo do popup.html
        const popupContent = await this.loadPopupContent();

        // Usa DOMParser para transformar a string HTML em um documento
        const parser = new DOMParser();
        const doc = parser.parseFromString(popupContent, 'text/html');

        // Pega o conteúdo do body do popup.html
        const bodyContent = doc.body;

        // Cria um container temporário para adicionar o conteúdo do body
        const tempContainer = document.createElement('div');
        tempContainer.appendChild(bodyContent);

        // Obtém o elemento com id 'root' e adiciona o conteúdo dinâmico
        const rootElement = tempContainer.querySelector('#root');
        if (rootElement) {
            const customContent = document.createElement('div');
            customContent.innerText = `Texto selecionado: ${selection.toString()}`;
            rootElement.appendChild(customContent);

            popup.appendChild(rootElement); // Adiciona o conteúdo ao popup
        }

        popup.appendChild(closeButton);

        popup.addEventListener('click', () => {
            document.body.removeChild(popup);
        });

        console.log(popup)


        document.body.appendChild(popup);
    }

    /**
     * @returns {Promise<string>} Retorna o conteúdo do popup.html como string.
     */
    async loadPopupContent(): Promise<string> {
        const response = await fetch(chrome.runtime.getURL('index.html'));
        return await response.text();
    }
}

new Main();