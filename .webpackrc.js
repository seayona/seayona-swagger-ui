const path = require("path")

export default {
    extraBabelPlugins: [
        ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
    ],
    theme: {
        "text-color": "black",
        "menu-highlight-color": "black",
        "menu-item-color": "black",
        "menu-item-active-border-width": "3px",
        "menu-item-active-bg": "rgba(0, 0, 0, 0)",
        "font-family": ' "Microsoft YaHei",-apple-system, BlinkMacSystemFont,  "Helvetica Neue", Helvetica, Arial, sans-serif,"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
    },
    alias: {
        '@root': path.resolve(__dirname, 'src/'),
        '@routes': path.resolve(__dirname, 'src/routes/'),
        '@assets': path.resolve(__dirname, 'src/assets/'),
        '@components': path.resolve(__dirname, 'src/components/'),
        '@models': path.resolve(__dirname, 'src/models/'),
        '@services': path.resolve(__dirname, 'src/services/'),
        '@utils': path.resolve(__dirname, 'src/utils/')
    }
};