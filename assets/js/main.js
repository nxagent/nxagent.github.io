function copyInstall() {
    navigator.clipboard.writeText('pip install nx-agent');
    const t = document.getElementById('toast');
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
  }
