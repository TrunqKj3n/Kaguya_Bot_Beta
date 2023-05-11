# Hướng dẫn cài đặt

Để sử dụng dự án, bạn cần thực hiện các bước sau:

## Clone repository từ GitHub
Sử dụng git để clone repository bằng lệnh sau:

```bash
git clone https://github.com/TrunqKj3n/Kaguya_18_4_2023

```
## Cài đặt dependencies

Chạy lệnh npm install để cài đặt các dependencies cần thiết cho dự án:

```bash
cd your-repository
npm install
```


## Cấu hình

Mở file setup/config.ts và điền MongoDB URI :

```ts
export default {
    "prefix": "!",
    "BOT_NAME": "TTK",
    "ADMIN_IDS": [],
    "options": {
        "forceLogin": true,
        "listenEvents": true,
        "listenTyping": false,
        "logLevel": "silent",
        "updatePresence": true,
        "selfListen": true,
        "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.36"
    },
    database: {
        uri: "", // put your mongodb uri here
    }
}
```

Lưu file và tiếp tục sử dụng dự án của bạn.

## Credentials

Đi tới file setup/credentials.json và điền appstate thông qua extensions [C3C-fbstate](https://github.com/c3cbot/c3c-fbstate)
```json
[
    {
        "key": "sb",
        "value": "ZHzWY-I3yEuwJCAwhpBgbdu6",
        "domain": "facebook.com",
        "path": "/",
        "hostOnly": false,
        "creation": "2023-04-13T13:20:08.826Z",
        "lastAccessed": "2023-04-13T13:20:08.827Z"
    }
]
```

### License & Copyright :

- This Project is
  [MIT License](https://github.com/TrunqKj3n/TelegramBot_Typescript/blob/main/LICENSE)
  Licensed
- Copyright 2023 by [TrunqKj3n](https://facebook.com/ThieuTrungKi3n)
