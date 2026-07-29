# Về nguồn gốc của repo này

Repo này được dựng lại từ **chính bản 1.1.0 đã publish trên VS Code Marketplace**, sau khi
bản clone source gốc không còn tồn tại ở đâu trên máy build.

Lý do phải dựng lại: manifest của extension khai
`repository: https://github.com/huuhuybn/miconvert-icon-generator`, nhưng repo đó chưa từng
được tạo (404) — nên trang listing trên Marketplace mang một link chết.

## Trong này có gì

Toàn bộ nội dung của gói `.vsix` 1.1.0 tải từ Marketplace:

- `out/*.js` — **artifact đã biên dịch** bằng `tsc` (CommonJS, chưa minify, chưa strip)
- `package.json` — manifest gốc, giữ nguyên
- `package.nls*.json` — 13 ngôn ngữ
- `readme.md`, `changelog.md`, `LICENSE.txt`, `icons/icon.png`

## Cái đang thiếu

**`src/*.ts` gốc đã mất.** Hệ quả:

- `npm run compile` (`tsc -p ./`) **sẽ fail** — không có `src/`, không có `tsconfig.json`.
- `npm run lint` (`eslint src --ext ts`) cũng vậy.

Hai script đó được giữ nguyên trong `package.json` để ghi lại đúng cách build của bản gốc,
không phải vì chúng chạy được ở trạng thái hiện tại.

Extension **vẫn chạy bình thường**: VS Code load thẳng `out/extension.js` (`main`), không cần
bước biên dịch nào. Sửa nhanh thì sửa trực tiếp trong `out/`.

Muốn khôi phục hẳn TypeScript thì phải viết lại `src/` từ `out/` — output của `tsc` đọc được
nên dịch ngược là khả thi, nhưng **kiểu (type) đã bị xoá lúc biên dịch**, ai làm sẽ phải tự
khai lại. Chưa làm ở đây vì không muốn bịa ra source rồi gọi nó là bản gốc.
