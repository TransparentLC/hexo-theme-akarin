// How to identify a given string is hex color format
// https://stackoverflow.com/questions/1636350/how-to-identify-a-given-string-is-hex-color-format#answer-13624916
hexo.extend.helper.register(
    'isCssColor',
    str => str.match(
        /^(#[a-f0-9]{6}|#[a-f0-9]{3}|rgb *\( *[0-9]{1,3}%? *, *[0-9]{1,3}%? *, *[0-9]{1,3}%? *\)|rgba *\( *[0-9]{1,3}%? *, *[0-9]{1,3}%? *, *[0-9]{1,3}%? *, *[0-9]{1,3}%? *\))$/i
    )
);