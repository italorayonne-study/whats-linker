type CreatePopupSchema = {
    value: string
}

export class Main {

    constructor() {
        this.getSelectionValue()
    }

    handleSelectedValue(value: string): void {

        if (!this.validateContactNumber(value)) {
            return
        } else {
            this.createPopup(value)
        }
    }

    getSelectionValue(): void {
        document.addEventListener('mouseup', () => {
            const highlightedValue: string | undefined = window.getSelection()?.toString().trim();

            if (!highlightedValue) return

            const clearValue = highlightedValue?.replace(/\D/g, '').trim() || '';

            this.handleSelectedValue(clearValue)
        })
    }

    /**
     * 
     * @param value Número de contato a ser validado.
     * @returns {boolean} Retorna true se for válido, false caso contrário.
     */
    validateContactNumber(value: string): boolean {
        return value.length == 10 || value.length == 11
    }

    async createPopup(value: string): Promise<void> {
        const selection = window.getSelection();

        if (!selection || selection.isCollapsed) return; // Verifica se há texto selecionado.

        const range = selection.getRangeAt(0);
        const clientRect = range.getBoundingClientRect();

        const popup = document.createElement('div');
        popup.classList.add('card', 'w-38');

        popup.style.left = `${clientRect.left + window.scrollX}px`;
        popup.style.top = `${clientRect.bottom + window.scrollY}px`;

        const popupContent = await this.loadPopupContent();

        const parser = new DOMParser();
        const doc = parser.parseFromString(popupContent, 'text/html');

        const bodyContent = doc.body.innerHTML

        const container = document.createElement('div');
        container.innerHTML = bodyContent;

        popup.appendChild(container);

        const rootElement = popup.querySelector('card-content');
        if (rootElement) {
            const customContent = document.createElement('span');
            customContent.innerText = `Texto selecionado: ${selection.toString()}`;
            rootElement.appendChild(customContent);

            popup.appendChild(rootElement); // Adiciona o conteúdo ao popup
        }

        const closeButtonElement = popup.querySelector('.close');
        const chatButtonElement = popup.querySelector('#chat-whats-linker')
        const selectedNumberElement = popup.querySelector('#select-number');

        selectedNumberElement!.textContent = this.phoneMask(value)

        chatButtonElement?.addEventListener('click', () => {
            const contact = selectedNumberElement?.textContent;
            const formattedNumber = contact!.replace(/\D/g, '');

            const url = `https://web.whatsapp.com/send?phone=${formattedNumber}`;

            window.open(url, '_blank');

        })


        closeButtonElement?.addEventListener('click', () => {
            this.removeElement(popup)
        })

        document.body.appendChild(popup);
        selection.removeAllRanges()

    }


    removeElement(element: HTMLDivElement) {

        document.body.removeChild(element)
    }

    phoneMask(value: string) {
        return value
            .replace(/\D/g, '')
            ?.replace(/(\d{2})(\d)/, '($1) $2')
            ?.replace(/(\d{4,5})(\d{4})$/, '$1-$2')
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