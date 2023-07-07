import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';
import Logo from './components/Logo';

const config: DocsThemeConfig = {
    logo: <Logo />,
    project: {
        link: 'https://github.com/remcostoeten',
    },
    chat: {
        link: 'https://discord.com',
    },
};

export default config;
