# Resuperck Boost

[English](README.md)

Бесплатное приложение для Windows 10 / 11 x64: информация о компьютере, настройки Windows, игровые профили и графические инструменты в одном интерфейсе.

- [Сайт](https://kluchkoartem3-hash.github.io/resuperck-boost/)
- [Скачать 1.4.0 для Windows](https://github.com/kluchkoartem3-hash/resuperck-boost/releases/download/v1.4.0/ResuperckBoost-Setup-1.4.0.exe)
- [Исходники программы и инструкции сборки](https://github.com/kluchkoartem3-hash/resuperck-boost/releases/download/v1.4.0/ResuperckBoost-1.4.0-sources.zip)
- [Описание релиза и контрольные суммы](https://github.com/kluchkoartem3-hash/resuperck-boost/releases/tag/v1.4.0)

![Обзор оборудования в Resuperck Boost](assets/screenshots/overview.png)

Скриншот использует демонстрационные данные. Графические функции зависят от игры и оборудования; в играх с ограничениями античита используйте штатные настройки.

В этом репозитории размещён сайт. Код приложения, инструкции сборки и лицензии зависимостей находятся в отдельном архиве исходников по ссылке выше.

## Для разработчика сайта

Сайт статический, сборка и установка зависимостей не требуются. Публикация: Settings → Pages → Deploy from a branch → `main` → `/(root)`. Файл `.nojekyll` отключает обработку Jekyll.

Публичные настройки находятся в `site-config.js`: `brand`, `version`, `telegramUrl`, `contactTelegramUrl`, `releaseUrl` и `contactEndpoint`. Пока `contactEndpoint` равен `null`, форма скрыта и доступна связь через Telegram. Отправка писем требует подключённого обработчика или сервиса форм. Установщик и архив исходников хранятся в Releases; при новом релизе обновляйте ссылки в `site-config.js` и `index.html`.

В окне поддержки доступны настроенные публичные ссылки `revolutUrl` (Revolut.me), `monobankUrl` (Банка на send.monobank.ua) и `boostyUrl` (страница автора на boosty.to). Значение `null` скрывает соответствующий способ. До их подключения посетителю доступны действующие реквизиты в Telegram. Карточные данные и банковские секреты сайт не собирает.

Для локального просмотра запустите `py -3 -m http.server 8000 --bind 127.0.0.1` из папки сайта и откройте `http://127.0.0.1:8000/`. Изображения и шрифты не требуют внешних сервисов; выбор темы сохраняется в браузере.
