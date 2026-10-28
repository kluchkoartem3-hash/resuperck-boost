(() => {
  "use strict";
  const config = window.RESUPERCK_CONFIG || {};
  const root = document.documentElement;
  const themeButton = document.getElementById("theme-toggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const toast = document.getElementById("toast");
  let toastTimer;

  function publicUrl(raw, fallback = null) {
    if (typeof raw !== "string" || /[\u0000-\u0020\u007f\\]/.test(raw)) return fallback;
    try {
      const url = new URL(raw, location.href);
      if (url.username || url.password) return fallback;
      if (((raw.startsWith("/") && !raw.startsWith("//")) || raw.startsWith("./")) && url.origin === location.origin) return url.href;
      return url.protocol === "https:" ? url.href : fallback;
    } catch (_) { return fallback; }
  }
  const supportShareUrl = "https://resuperck.pages.dev/#support";
  document.querySelectorAll(".contact-telegram-link").forEach(link => {
    link.href = publicUrl(config.contactTelegramUrl, "https://t.me/supernaturalizm");
  });
  document.querySelectorAll(".project-telegram-link").forEach(link => {
    link.href = publicUrl(config.projectTelegramUrl, "https://t.me/Resuperck_Tools");
  });
  const releaseUrl = publicUrl(config.releaseUrl);
  document.querySelectorAll(".download-link").forEach(link => {
    if (releaseUrl) link.href = releaseUrl;
    else {
      link.removeAttribute("download");
      link.href = "#contact";
      link.replaceChildren(document.createTextNode("Уточнить доступность загрузки"));
    }
  });

  function applyTheme(theme) {
    const dark = theme !== "light";
    root.dataset.theme = dark ? "dark" : "light";
    const label = dark ? "Включить светлую тему" : "Включить тёмную тему";
    themeButton.setAttribute("aria-label", label);
    themeButton.setAttribute("title", label);
    themeButton.setAttribute("aria-pressed", String(dark));
    themeButton.querySelector(".theme-label").textContent = label;
    themeButton.querySelector("use").setAttribute("href", dark ? "#i-sun" : "#i-moon");
    themeColor.content = dark ? "#0d0e12" : "#f7f7fa";
  }
  applyTheme(root.dataset.theme);
  themeButton.addEventListener("click", () => {
    const theme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    try { localStorage.setItem("resuperck-theme", theme); } catch (_) {}
  });
  window.addEventListener("storage", event => {
    if (event.key === "resuperck-theme") applyTheme(event.newValue === "light" ? "light" : "dark");
  });

  function notify(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 5000);
  }
  function copyFallback(text) {
    const field = document.createElement("textarea");
    field.value = text;
    field.readOnly = true;
    field.setAttribute("aria-label", "Ссылка на раздел поддержки");
    Object.assign(field.style, { position: "fixed", top: "0", left: "0", width: "1px", height: "1px", opacity: "0", pointerEvents: "none" });
    const focus = document.activeElement;
    document.body.append(field);
    field.select();
    field.setSelectionRange(0, text.length);
    let copied = false;
    try { copied = document.execCommand("copy"); } catch (_) {}
    field.remove();
    if (focus instanceof HTMLElement) focus.focus({ preventScroll: true });
    return copied;
  }
  const copyButton = document.getElementById("copy-link");
  let copyReset;
  copyButton.addEventListener("click", async () => {
    if (copyButton.disabled) return;
    copyButton.disabled = true;
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(supportShareUrl); copied = true; }
    } catch (_) {}
    if (!copied) copied = copyFallback(supportShareUrl);
    copyButton.disabled = false;
    clearTimeout(copyReset);
    copyButton.querySelector("span").textContent = copied ? "Ссылка скопирована" : "Не удалось скопировать";
    copyButton.querySelector("use").setAttribute("href", copied ? "#i-check" : "#i-copy");
    notify(copied ? "Ссылка на раздел поддержки скопирована." : "Копирование запрещено браузером. Ссылка на поддержку: " + supportShareUrl);
    copyReset = setTimeout(() => {
      copyButton.querySelector("span").textContent = "Скопировать ссылку";
      copyButton.querySelector("use").setAttribute("href", "#i-copy");
    }, 3500);
  });

  function makeDialog(dialog, closeButton) {
    let previousFocus;
    let previousOverflow;
    const close = () => dialog.close();
    closeButton.addEventListener("click", close);
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
    });
    dialog.addEventListener("close", () => {
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
    });
    return {
      open() {
        if (dialog.open) return;
        previousFocus = document.activeElement;
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        dialog.showModal();
        closeButton.focus();
      }, close,
    };
  }
  const privacy = makeDialog(document.getElementById("privacy-dialog"), document.getElementById("privacy-close"));
  document.getElementById("privacy-button").addEventListener("click", privacy.open);
  document.getElementById("privacy-done").addEventListener("click", privacy.close);
  const support = makeDialog(document.getElementById("support-dialog"), document.getElementById("support-close"));
  document.getElementById("support-open").addEventListener("click", event => {
    event.preventDefault();
    support.open();
  });
  const receivingLinks = [
    { key: "revolutUrl", id: "revolut", hosts: ["revolut.me"] },
    { key: "monobankUrl", id: "monobank", hosts: ["send.monobank.ua"] },
    { key: "boostyUrl", id: "boosty", hosts: ["boosty.to"] },
  ];
  let connectedMethods = 0;
  for (const method of receivingLinks) {
    const row = document.getElementById(`support-${method.id}`);
    const link = row.querySelector("a");
    const status = row.querySelector(".method-status");
    const url = publicUrl(config[method.key]);
    if (url && method.hosts.includes(new URL(url).hostname) && new URL(url).pathname !== "/") {
      row.hidden = false;
      link.href = url;
      link.hidden = false;
      status.hidden = true;
      connectedMethods += 1;
    } else {
      row.hidden = true;
      link.hidden = true;
      link.removeAttribute("href");
      status.hidden = false;
    }
  }
  document.querySelector(".support-methods").hidden = connectedMethods === 0;
  const lightbox = makeDialog(document.getElementById("screenshot-dialog"), document.getElementById("screenshot-close"));
  const lightboxImage = document.getElementById("screenshot-image");
  document.querySelectorAll(".screenshot-button").forEach(button => {
    button.addEventListener("click", () => {
      lightboxImage.src = button.dataset.screenshot;
      lightboxImage.alt = button.querySelector("img").alt;
      document.getElementById("screenshot-caption").textContent = button.dataset.caption;
      lightbox.open();
    });
  });

  const form = document.getElementById("contact-form");
  const fields = document.getElementById("contact-fields");
  const submitButton = document.getElementById("contact-submit");
  const status = document.getElementById("contact-status");
  const message = document.getElementById("message-body");
  const messageCount = document.getElementById("message-count");
  const endpoint = publicUrl(config.contactEndpoint);
  const isFormspree = endpoint && new URL(endpoint).hostname === "formspree.io"
    && /^\/f\/[A-Za-z0-9]+$/.test(new URL(endpoint).pathname);
  let sending = false;
  function formStatus(text, state = "") { status.textContent = text; status.dataset.state = state; }
  function countMessage() { messageCount.textContent = `${message.value.length} / 5000`; }
  message.addEventListener("input", countMessage);
  if (!endpoint) {
    form.hidden = true;
  } else {
    form.hidden = false;
    document.getElementById("contact-unavailable").hidden = true;
    document.getElementById("privacy-contact-text").textContent = isFormspree
      ? "Форма связи передаёт указанную почту, тему и текст сообщения через Formspree разработчику для ответа. Не указывайте секретные сведения."
      : "Форма связи передаёт указанную почту, тему и текст сообщения через подключённый сервис доставки разработчику для ответа. Не указывайте секретные сведения.";
    formStatus("");
  }
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!endpoint || sending || !form.reportValidity()) return;
    const payload = {
      replyEmail: form.elements.replyEmail.value.trim(),
      subject: form.elements.subject.value.trim(),
      message: form.elements.message.value.trim(),
      website: form.elements.website.value,
    };
    const deliveryPayload = isFormspree ? {
      email: payload.replyEmail, subject: payload.subject,
      message: payload.message, _gotcha: payload.website,
    } : payload;
    if (payload.subject.length < 3 || payload.message.length < 10) {
      formStatus("Добавьте тему от 3 символов и сообщение от 10 символов.", "error");
      return;
    }
    sending = true;
    fields.disabled = true;
    submitButton.firstChild.textContent = "Отправляем…";
    formStatus("Доставляем ваше сообщение…");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 18000);
    try {
      const response = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
        credentials: "omit", body: JSON.stringify(deliveryPayload), signal: controller.signal,
      });
      let result = null;
      try { result = await response.json(); } catch (_) {}
      if (response.ok && (isFormspree ? !Array.isArray(result?.errors) : result?.ok === true)) {
        form.reset(); countMessage();
        formStatus("Сообщение отправлено. Для ответа разработчик сможет использовать указанную вами почту.", "success");
      } else if (response.status === 429) {
        formStatus("Слишком много попыток. Подождите несколько минут и попробуйте снова.", "error");
      } else if (response.status === 400 || response.status === 422) {
        formStatus("Проверьте почту, тему и текст сообщения. Сообщение не отправлено.", "error");
      } else {
        formStatus("Отправить сообщение не удалось. Текст сохранён в форме — попробуйте позже.", "error");
      }
    } catch (_) {
      formStatus("Не удалось дождаться подтверждения отправки. Текст сохранён в форме. Проверьте соединение и попробуйте позже.", "error");
    } finally {
      clearTimeout(timeout);
      sending = false;
      fields.disabled = false;
      submitButton.firstChild.textContent = "Отправить сообщение";
    }
  });
})();
