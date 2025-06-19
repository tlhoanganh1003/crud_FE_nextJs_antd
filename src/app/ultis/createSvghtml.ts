function createSvgHtml(symbol: SVGSymbolElement): string {
    const viewBox = symbol.getAttribute('viewBox') ?? '0 0 24 24';
    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgEl.setAttribute('viewBox', viewBox);
    svgEl.style.width = '1.2em';
    svgEl.style.height = '1.2em';
    svgEl.style.verticalAlign = 'middle';
    svgEl.style.display = 'inline-block';
    Array.from(symbol.childNodes).forEach(child => {
        svgEl.appendChild(child.cloneNode(true));
    });
    return svgEl.outerHTML;
}

export default createSvgHtml