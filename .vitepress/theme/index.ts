import DefaultTheme from 'vitepress/theme';
import './custom.css';

export default {
    extends: DefaultTheme,
    // enhanceApp({ app, router }) {
    //     if (typeof window !== 'undefined') {
    //         // Intercept GitHub link clicks
    //         document.addEventListener('click', (e) => {
    //             const target = e.target as HTMLElement;
    //             const link = target.closest('a[href*="github.com"]');
    //             if (link && link.closest('.VPSocialLinks')) {
    //                 e.preventDefault();
    //                 showGitHubModal();
    //             }
    //         });
    //     }
    // }
};

function showGitHubModal() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.id = 'github-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;

    // Create modal content
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: var(--vp-c-bg);
        border: 1px solid var(--vp-c-border);
        border-radius: 12px;
        padding: 24px 32px;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    `;
    modal.innerHTML = `
        <h3 style="margin: 0 0 12px 0; font-size: 18px;">Not Open Source Yet</h3>
        <p style="margin: 0 0 20px 0; color: var(--vp-c-text-2);">
            This project is currently private, but I'd be happy to walk you through the codebase in an interview.
        </p>
        <button id="github-modal-close" style="
            background: var(--vp-c-brand);
            color: white;
            border: none;
            padding: 8px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
        ">Got it</button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Close handlers
    const close = () => overlay.remove();
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });
    document.getElementById('github-modal-close')?.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    }, { once: true });
}
