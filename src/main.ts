type CreatePopupSchema = {
    selection: Selection,
    value: string
}


class Main {

    constructor() {
        this.getSelectionValue()
    }

    handleSelectedValue(value: string): void {
        const selection = window.getSelection();

        if (!selection || selection.isCollapsed) return; // Verifica se há texto selecionado.

        if (this.validateContactNumber(value)) {


            this.createPopup({ selection, value })
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

        return clearValue.length >= 10 || clearValue.length < 12
    }


    async createPopup({ selection, value }: CreatePopupSchema): Promise<void> {
        // const selection = window.getSelection();

        // if (!selection || selection.isCollapsed) return; // Verifica se há texto selecionado.

        const range = selection.getRangeAt(0);
        const clientRect = range.getBoundingClientRect();

        const popup = document.createElement('div');
        popup.classList.add('card', 'w-38');

        popup.style.left = `${clientRect.left + window.scrollX}px`;
        popup.style.top = `${clientRect.bottom + window.scrollY}px`;

        const popupContent = await this.loadPopupContent();

        const parser = new DOMParser();
        const doc = parser.parseFromString(popupContent, 'text/html');

        const bodyContent = doc.body;
        console.log(bodyContent)

        popup.appendChild(bodyContent);

        const rootElement = popup.querySelector('card-content');
        if (rootElement) {
            const customContent = document.createElement('span');
            customContent.innerText = `Texto selecionado: ${selection.toString()}`;
            rootElement.appendChild(customContent);

            popup.appendChild(rootElement); // Adiciona o conteúdo ao popup
        }

        const buttonElement = popup.querySelector('button');
        const selectedNumberElement = popup.querySelector('#select-number');

        selectedNumberElement!.textContent = value

        buttonElement?.addEventListener('click', () => {

            selection.removeRange

            document.body.removeChild(popup)
        })

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