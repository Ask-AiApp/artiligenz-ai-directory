class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                footer {
                    background-color: var(--dark);
                    color: white;
                    padding: 2rem 0;
                    margin-top: 3rem;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1rem;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 2rem;
                }
                .footer-section h3 {
                    font-size: 1rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    color: var(--secondary);
                }
                .footer-links {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .footer-links a {
                    color: rgba(255,255,255,0.7);
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .footer-links a:hover {
                    color: white;
                }
                .copyright {
                    text-align: center;
                    margin-top: 2rem;
                    padding-top: 1rem;
                    border-top: 1px solid rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.5);
                    font-size: 0.875rem;
                }
            </style>
            <footer>
                <div class="container">
                    <div class="footer-section">
                        <h3>Explore</h3>
                        <div class="footer-links">
                            <a href="/">Home</a>
                            <a href="/about">About</a>
                            <a href="/explore">Entities</a>
                            <a href="/relations">Relationships</a>
                        </div>
                    </div>
                    <div class="footer-section">
                        <h3>Resources</h3>
                        <div class="footer-links">
                            <a href="/docs">Documentation</a>
                            <a href="/api">API</a>
                            <a href="/blog">Blog</a>
                            <a href="/faq">FAQ</a>
                        </div>
                    </div>
                    <div class="footer-section">
                        <h3>Connect</h3>
                        <div class="footer-links">
                            <a href="mailto:info@example.com">Contact</a>
                            <a href="https://twitter.com/example" target="_blank">Twitter</a>
                            <a href="https://github.com/example" target="_blank">GitHub</a>
                            <a href="https://linkedin.com/company/example" target="_blank">LinkedIn</a>
                        </div>
                    </div>
                </div>
                <div class="copyright">
                    &copy; ${new Date().getFullYear()} AI Constellation Navigator. All rights reserved.
                </div>
            </footer>
        `;
    }
}

customElements.define('custom-footer', CustomFooter);