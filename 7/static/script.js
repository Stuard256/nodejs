window.onload = () => {
    let height = 0;
    setInterval(() => {
        let element = document.getElementById('animated');
        if (element != undefined) {
            element.style.top = height + 'px';
            element.style.left = width + 'px';
            if (height <= 500 && width <= 1000) {
                height += 0.5;
                width += 0.75;
            }
               
        }
    }, 16);
};