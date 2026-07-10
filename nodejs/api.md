# JINFENG Backend API

Base URL: `https://<your-domain>/v2`

所有回應皆為 `application/json`。需要帶 body 的請求請加上 `Content-Type: application/json`。

## 認證

需要登入的端點，在 header 帶：

```
Authorization: Bearer <token>
```

`token` 由 `POST /auth/login` 取得，內容為 JWT，預設效期 1 天（`JWT_EXPIRES_IN`）。

管理端點（`/admin/*`）除了要有效登入外，還需要該使用者 `is_admin = true`，否則回 403。

### 錯誤格式

**驗證失敗（400）**（欄位格式錯誤、必填未填等）：

```json
{ "status": "error", "message": "請輸入姓名" }
```

`message` 為第一個驗證錯誤的訊息（中文）。

**未登入 / token 無效或已登出（401）**：

```json
{ "message": "未授權" }
```

**已登入但非管理員（403，僅 `/admin/*`）**：

```json
{ "message": "權限不足" }
```

**找不到資料（404）**：

```json
{ "message": "找不到資料" }
```

**伺服器錯誤（500）**：

```json
{ "status": "error", "message": "伺服器發生錯誤" }
```

### 分頁格式

有分頁的端點回傳 Laravel `paginate()`相容格式：

```json
{
  "current_page": 1,
  "data": [ ... ],
  "first_page_url": "/v2/admin/contact?page=1",
  "from": 1,
  "last_page": 3,
  "last_page_url": "/v2/admin/contact?page=3",
  "next_page_url": "/v2/admin/contact?page=2",
  "path": "/v2/admin/contact",
  "per_page": 10,
  "prev_page_url": null,
  "to": 10,
  "total": 25
}
```

`page` 透過 query string 指定（例如 `?page=2`），未帶則預設第 1 頁，每頁固定 10 筆。

---

## 公開端點（不需登入）

### `GET /seo`

回傳所有 SEO 資料（唯讀，此表由另一套 CMS 系統管理內容）。

**回應 200**：
```json
[
  {
    "id": 1,
    "classId": null,
    "relateId": 1,
    "tag": "home",
    "name": "seo1",
    "title": "title1",
    "description": "desc1",
    "url": "/",
    "type": "page",
    "keyword": "kw",
    "pic": "pic.png",
    "picAlt": "alt",
    "del": false,
    "createdAt": null,
    "updatedAt": null
  }
]
```

---

### `GET /contact-class`

回傳未刪除（`del=false`）的課程分類，依 `no` 由大到小排序。

**回應 200**：
```json
[
  { "id": 2, "name": "進階班", "no": 2, "del": false, "createdAt": "...", "updatedAt": "..." },
  { "id": 1, "name": "基礎班", "no": 1, "del": false, "createdAt": "...", "updatedAt": "..." }
]
```

---

### `GET /contact-quest`

回傳未刪除的問題分類，分頁（每頁 10 筆），依 `no` 由大到小排序。

**Query**：`page`（選填，預設 1）

**回應 200**：分頁格式，`data` 為：
```json
{ "id": 1, "name": "問題A", "no": 1, "del": false, "createdAt": "...", "updatedAt": "..." }
```

---

### `GET /faq`

回傳 FAQ 列表（唯讀，此表由另一套 CMS 系統管理，本 API 只投影 `id/name/info/no` 四個欄位），依 `no` 由大到小排序。**結果快取 24 小時**（Redis key `faq`），24 小時內即使資料庫有新資料也不會反映在這個端點。

**回應 200**：
```json
[
  { "id": 3, "name": "常見問題1", "info": "這是內容", "no": 5 }
]
```

---

### `POST /contact`

公開報名/聯絡表單。建立一筆 Contact，並巢狀建立多筆 ContactList（報名人資料），成功後會非同步（透過 BullMQ 佇列）寄送通知信到 `RECIPIENT_EMAIL`。

**Body**：

| 欄位 | 型別 | 必填 | 說明 |
|---|---|---|---|
| `class` | string | 是 | 報名課程 |
| `quest` | string | 是 | 主要問題 |
| `company` | string | 是 | 公司名稱 |
| `tel` | string，最長 10 字元 | 是 | 電話 |
| `num` | string | 是 | 報名人數 |
| `last5` | string，最長 5 字元 | 否 | 匯款帳號末五碼 |
| `ticket` | `"2"` 或 `"3"` | 否 | 發票種類 |
| `ticket_name` | string | 否 | 發票抬頭 |
| `ticket_no` | string | 否 | 統一編號 |
| `ticket_address` | string | 否 | 發票地址 |
| `from` | string | 否 | 得知講座管道 |
| `suggest_name` | string | 否 | 推薦人姓名 |
| `contactList` | array，至少 1 筆 | 是 | 報名人清單，見下 |

`contactList[]` 每筆：

| 欄位 | 型別 | 必填 | 說明 |
|---|---|---|---|
| `name` | string | 是 | 姓名 |
| `email` | string（email 格式） | 是 | 信箱 |
| `job` | string | 否 | 職稱 |
| `cel` | string，最長 10 字元 | 是 | 手機 |

**範例請求**：
```json
{
  "class": "測試課程",
  "quest": "想了解課程內容",
  "company": "測試公司",
  "tel": "0912345678",
  "num": "2",
  "contactList": [
    { "name": "王小明", "email": "wang@example.com", "job": "工程師", "cel": "0987654321" }
  ]
}
```

**回應 201**：
```json
{
  "message": "新增成功",
  "data": {
    "id": 1,
    "class": "測試課程",
    "quest": "想了解課程內容",
    "company": "測試公司",
    "tel": "0912345678",
    "num": "2",
    "last5": null,
    "ticket": null,
    "ticketName": null,
    "ticketNo": null,
    "ticketAddress": null,
    "from": null,
    "suggestName": null,
    "del": false,
    "no": 0,
    "createdAt": "...",
    "updatedAt": "...",
    "contactList": [
      { "id": 1, "name": "王小明", "cel": "0987654321", "job": "工程師", "email": "wang@example.com", "no": 0, "cid": 1, "createdAt": "...", "updatedAt": "..." }
    ]
  }
}
```

**400**：驗證失敗，見上方「錯誤格式」。

---

### `POST /auth/register`

註冊新使用者。**新帳號一律建立為一般使用者（`is_admin` 永遠是 `false`）**——即使 body 帶 `is_admin`，也會被忽略。要建立管理員帳號，需要直接在資料庫把該使用者的 `is_admin` 改為 `true`。

**Body**：

| 欄位 | 型別 | 必填 | 說明 |
|---|---|---|---|
| `name` | string | 是 | 姓名 |
| `email` | string（email 格式） | 是 | 信箱，需未被註冊過 |
| `password` | string，至少 6 字元 | 是 | 密碼 |
| `password_confirmation` | string | 是 | 需與 `password` 相同 |

**回應 201**：
```json
{ "message": "註冊成功" }
```

**400**：
- 信箱已被註冊：`{ "status": "error", "message": "信箱已被註冊" }`
- 密碼不一致：`{ "status": "error", "message": "密碼不一致" }`
- 其他驗證錯誤：格式同上

---

### `POST /auth/login`

**Body**：

| 欄位 | 型別 | 必填 |
|---|---|---|
| `email` | string（email 格式） | 是 |
| `password` | string | 是 |

**回應 200**：
```json
{ "token": "eyJhbGciOi..." }
```

**401**：
```json
{ "message": "帳號或密碼錯誤" }
```

---

### `POST /auth/logout`

**需要登入**（`Authorization: Bearer <token>`）。撤銷目前這個 token（寫入 Redis 黑名單，效期至 token 原本的到期時間），撤銷後這個 token 無法再用於任何需要登入的端點。

**回應 200**：
```json
{ "message": "登出成功" }
```

---

## 管理端點（需要登入 + `is_admin = true`）

Base path：`/admin`。未帶 token → 401；已登入但非管理員 → 403。

### `GET /admin/contact`

分頁列出所有報名資料，依 `createdAt` 新到舊排序。

**Query**：`page`（選填）

**回應 200**：分頁格式，`data` 內每筆為 Contact 物件（欄位同 `POST /contact` 回傳的 `data`，但不含 `contactList`）。

---

### `GET /admin/contact/search/search-company`

依公司名稱模糊搜尋（`LIKE %keyword%`，大小寫不敏感）。

**Query**：
| 參數 | 型別 | 必填 |
|---|---|---|
| `company` | string | 是（未帶視為空字串，會回傳全部） |
| `page` | number | 否 |

**回應 200**：分頁格式，同 `GET /admin/contact`。

---

### `GET /admin/contact/:id`

取得單筆報名資料，含巢狀 `contactList`。

**回應 200**：Contact 物件（含 `contactList` 陣列）。
**回應 404**：`{ "message": "找不到資料" }`

---

### `PUT /admin/contact/:id` / `PATCH /admin/contact/:id`

更新報名資料。Body 格式與 `POST /contact` 完全相同（含 `contactList`，但**更新時不會異動既有的 contactList**，僅更新 Contact 本身的欄位）。

**回應 200**：
```json
{ "message": "更新成功", "data": { ...Contact } }
```
**回應 404**：`{ "message": "找不到資料" }`

---

### `DELETE /admin/contact`

刪除報名資料（實體刪除），**會一併刪除該筆底下所有的 contactList 資料**。支援單筆或多筆：

**Body（多筆）**：
```json
{ "ids": [1, 2, 3] }
```
**Body（單筆）**：
```json
{ "ids": 1 }
```

**回應 200**：`{ "message": "刪除成功" }`
**回應 404（多筆時，部分 id 不存在）**：
```json
{ "message": "以下的 id 不存在: 2, 3" }
```
**回應 404（單筆時 id 不存在）**：
```json
{ "message": "找不到 id: 1" }
```

---

### `GET /admin/contact-list`

列出**全部**報名人資料（無分頁、無篩選）。

**回應 200**：
```json
{ "data": [ { "id": 1, "name": "王小明", "cel": "0987654321", "job": "工程師", "email": "wang@example.com", "no": 0, "cid": 1, "createdAt": "...", "updatedAt": "..." } ] }
```

---

### `GET /admin/contact-list/:id`

**回應 200**：單筆 ContactList 物件（格式同上，未包 `data`）。
**回應 404**：`{ "message": "找不到資料" }`

---

### `POST /admin/contact-class`

新增課程分類。

**Body**：
| 欄位 | 型別 | 必填 |
|---|---|---|
| `name` | string | 是 |
| `no` | integer | 是 |

**回應 201**：
```json
{ "message": "新增成功", "data": { "id": 1, "name": "進階班", "no": 1, "del": false, "createdAt": "...", "updatedAt": "..." } }
```

---

### `GET /admin/contact-class/:id`

只會回傳 `del=false` 的資料。

**回應 200**：ContactClass 物件。
**回應 404**：`{ "message": "找不到資料" }`

---

### `PUT /admin/contact-class/:id` / `PATCH /admin/contact-class/:id`

**Body**：同 `POST /admin/contact-class`。

**回應 200**：`{ "message": "更新成功", "data": { ...ContactClass } }`
**回應 404**：`{ "message": "找不到資料" }`

---

### `DELETE /admin/contact-class`

實體刪除（不是軟刪除），支援單筆或多筆，格式與 `DELETE /admin/contact` 完全相同。

**Body**：`{ "ids": [1, 2] }` 或 `{ "ids": 1 }`

**回應 200**：`{ "message": "刪除成功" }`
**回應 404**：同 `DELETE /admin/contact` 的錯誤格式。

---

## 端點總覽

| Method | Path | 需登入 | 需 admin |
|---|---|:---:|:---:|
| GET | `/seo` | | |
| GET | `/contact-class` | | |
| GET | `/contact-quest` | | |
| POST | `/contact` | | |
| GET | `/faq` | | |
| POST | `/auth/register` | | |
| POST | `/auth/login` | | |
| POST | `/auth/logout` | ✓ | |
| GET | `/admin/contact` | ✓ | ✓ |
| GET | `/admin/contact/search/search-company` | ✓ | ✓ |
| GET | `/admin/contact/:id` | ✓ | ✓ |
| PUT/PATCH | `/admin/contact/:id` | ✓ | ✓ |
| DELETE | `/admin/contact` | ✓ | ✓ |
| GET | `/admin/contact-list` | ✓ | ✓ |
| GET | `/admin/contact-list/:id` | ✓ | ✓ |
| POST | `/admin/contact-class` | ✓ | ✓ |
| GET | `/admin/contact-class/:id` | ✓ | ✓ |
| PUT/PATCH | `/admin/contact-class/:id` | ✓ | ✓ |
| DELETE | `/admin/contact-class` | ✓ | ✓ |

**與舊 Laravel API 的行為差異**（詳見 commit message 與 `laravel-gleaming-backus.md`）：
- `/admin/*` 現在會檢查 `is_admin`，舊版只檢查有沒有登入。
- `POST /auth/register` 不再接受 `is_admin`。
- `PUT/PATCH /admin/contact/:id` 舊版必定報錯，現在正常運作。
- `DELETE /admin/contact` 現在會一併清除關聯的 `contactList`，舊版會留下孤兒資料。
