document.addEventListener('mouseup', () => {
    const selectedText: string | undefined = window.getSelection()?.toString().trim();

    if (!selectedText) throw new Error('Ocorreu um error ao destacar o texto selecionado.')

    if (selectedText?.length > 0) alert(`Texto selecionado: ${selectedText}`)
})