const fs = require('node:fs');
const lightningcss = require('lightningcss');
const swc = require('@swc/core');

const encoder = new TextEncoder;
const decoder = new TextDecoder;

for (const [input, output] of [
    ['source/css/shiki.css', 'source/css/shiki.min.css'],
    ['source/css/style.css', 'source/css/style.min.css'],
]) {
    fs.writeFileSync(
        output,
        decoder.decode(
            lightningcss.transform({
                filename: '',
                code: encoder.encode(fs.readFileSync(input, { encoding: 'utf-8' })),
                minify: true,
            }).code
        )
    );
}

for (const [input, output] of [
    ['source/js/script.js', 'source/js/script.min.js'],
]) {
    fs.writeFileSync(
        output,
        swc.minifySync(
            fs.readFileSync(input, { encoding: 'utf-8' }),
            {
                compress: {
                    // https://github.com/swc-project/swc/blob/main/crates/swc_ecma_minifier/src/option/terser.rs
                    // impl From<TerserEcmaVersion> for EsVersion
                    ecma: 2022,
                    arguments: true,
                    unsafe_arrows: true,
                    unsafe_math: true,
                    unsafe_methods: true,
                    unsafe_proto: true,
                    unsafe_regexp: true,
                    unsafe_symbols: true,
                    unsafe_undefined: true,
                },
                mangle: true,
                format: {
                    comments: false,
                },
                sourceMap: false,
            },
        ).code,
    );
}