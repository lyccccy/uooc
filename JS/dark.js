let isDarkTheme = false;
document.getElementById('changebutton').addEventListener('click', function() {
    console.log('切换主题按钮被点击');
    var link = document.getElementById('themeStylesheet');
    var currentHref = link.href;
    var baseName = currentHref.substring(currentHref.lastIndexOf('/') + 1);
    var newHref = isDarkTheme ? `./CSS/${baseName}` : `./darkcss/${baseName}`;
    link.href = newHref;
    isDarkTheme = !isDarkTheme;
});