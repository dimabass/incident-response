document.querySelectorAll('img').forEach(function(image) {
  image.classList.add('zoomable');
  
  image.addEventListener('click', function() {
    const imageUrl = image.src;
    const imageWindow = window.open();
    imageWindow.document.write(`<img src="${imageUrl}" style="width: 100%; height: auto;"/>`);
  });
});

