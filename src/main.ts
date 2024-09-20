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

        if (!selection) return;

        const range = selection.getRangeAt(0);
        const clientRect = range.getBoundingClientRect();

        const popup = document.createElement('div');

        popup.classList.add('custom-popup');

        popup.style.left = `${clientRect.left + window.scrollX}px`;
        popup.style.top = `${clientRect.bottom + window.scrollY}px`;

        const closeButton = document.createElement('button');
        closeButton.classList.add('close-btn');
        closeButton.innerHTML = '&times;'; // Símbolo de "x"
        closeButton.onclick = () => document.body.removeChild(popup);


        popup.addEventListener('click', () => {
            document.body.removeChild(popup);
        });

        const popupContent = await this.loadPopupContent();
        popup.innerHTML = popupContent;

        document.body.appendChild(popup);

    }

    /**
     * 
     * @returns {Promise<string>} Retorna o conteúdo do popup.html como string.
     */
    async loadPopupContent(): Promise<string> {
        const response = await fetch(chrome.runtime.getURL('popup.html'));

        return await response.text();
    }
}

new Main();