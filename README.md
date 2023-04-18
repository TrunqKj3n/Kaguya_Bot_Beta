# Hướng dẫn cài đặt

Để sử dụng dự án, bạn cần thực hiện các bước sau:

## Clone repository từ GitHub
Sử dụng git để clone repository bằng lệnh sau:

```bash
git clone https://github.com/your-username/your-repository.git

```
## Cài đặt dependencies

Chạy lệnh npm install để cài đặt các dependencies cần thiết cho dự án:

```bash
cd your-repository
npm install
```

## Cấu hình MongoDB URI

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
