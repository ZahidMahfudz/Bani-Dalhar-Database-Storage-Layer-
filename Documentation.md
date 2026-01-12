# Dokumentasi REST API Storage Layer

## 1. Informasi Umum
* base url 
```
https://script.google.com/macros/s/AKfycbwEZgnfp2Cb_Vaf41Zq09K2-QK-uK3hwlsEAfw6CnqKFDcVhthTSXrVpgQyp_aRcFWang/exec 
 ```
 * Format Data : JSON
 * Metode HTTP : GET, POST
 * Autentikasi : API KEY
  

## 2. Autentikasi
Setiap request **WAJIB** menyertakan `api key`

### method GET
dikirim melalui parameter :
```
?api_key=API_KEY
```
### method POST
dikirim melalui body dengan menyertakan :
```JSON
{
    "api_key": "API_KEY"
}
```

jika tidak valid akan menghasilkan response error sebagai berikut :
```JSON
{
    "status": "error",
    "massage": "API Key tidak valid"
}
```

> untuk mendapatkan API silahkan menghubungi pembuat dikarenakan sifat data yang tertutup dan tidak disebarluaskan

## 3. Struktur Data
| Kolom (key)      | Keterangan                                                                                    | Format                                                 |
| ---------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `person_id`      | ID anggota keluarga                                                                           | BDxxxxx (x merupakan 5 digit angka urutan ditambahkan) |
| `nama_lengkap`   | Nama lengkap anggota keluarga                                                                 | teks                                                   |
| `jenis_kelamin`  | Jenis Kelamin anggota keluarga                                                                | L/P                                                    |
| `tempat_lahir`   | Nama Tempat Lahir Anggota Keluarga                                                            | teks                                                   |
| `tanggal_lahir`  | tanggal Lahir anggota keluarga                                                                | mm/dd/yyyy                                             |
| `alamat_lengkap` | alamat lengkap anggota keluarga                                                               | teks                                                   |
| `no_hp`          | nomor hp atau whatsapp anggota keluarga                                                       | 11-12 digit angka                                      |
| `ayah_id`        | id dari ayah (diambil dari person id) untuk menyatakan hubungan ayah anak                     | BDxxxxx                                                |
| `ibu_id`         | id dari ibu (diambil dari person id) untuk menyatakan hubungan ibu anak                       | BDxxxxx                                                |
| `pasangan_id`    | id dari pasangan (diambil dari person id) untuk menyatakan hubungan pasangan anggota keluarga | BDxxxxx                                                |
| `generasi`       | untuk menyatakan generasi ke berapa anggota keluarga tersebut                                 | angka                                                  |
| `status_darah`   | memberikan keterangan aliran keturunan inti atau sebagai menantu                              | Inti/Menantu                                           |
| `foto`           | untuk menyimpan foto                                                                          | url/object foto                                        |

> untuk foto belum diujikan apakah dapat menyimpan foto secara mentah atau harus meletakan url foto untuk ditampilkan di front end nantinya

## 4. Endpoint Get

### 4.1. Ping API
digunakan untuk testing koneksi saja  
**Request**
```
GET [base url]
```
**Parameter**
```
- api_key=xxx
- action=ping
```
**response**
```JSON
{
    "status": "success",
    "massage": {
        "massage": "API Google Apps Script Bani Dalhar Sukses Aktif"
    },
    "data": null
}
```

### 4.2. getALL
digunakan untuk mendapatkan seluruh data keluarga  
**Request**
```
GET [base url]
```
**Parameter**
```
- api_key=xxx
- action=getAll
```
**response**
```JSON
{
    "status": "success",
    "massage": "Sukses mengambil semua data keluarga",
    "data": [
        {berisi seluruh data keluarga yang tercatat dalam spreadsheet}
    ]
}
```

### 4.3. getById
digunakan untuk mendapatkan salah satu data anggota keluarga  
**Request**
```
GET [base url]
```
**Parameter**
```
- api_key=xxx
- action=getById
- id=BDxxxxx
```
**response**
```JSON
{
    "status": "success",
    "massage": "Sukses mengambil semua data berdasarkan id",
    "data": [
        {berisi data anggota keluarga berdasarkan id}
    ]
}
```

### 4.4. getFamily
digunakan untuk menampilkan ayah, ibu, pasangan, dan seluruh anak dari anggota keluarga dengan id yang diminta  
**Request**
```
GET [base url]
```
**Parameter**
```
- api_key=xxx
- action=getFamily
- id=BDxxxxx
```
**response**
```JSON
{
    "status": "success",
    "massage": "Sukses mengambil semua data keluarga berdasarkan id",
    "data": {
        "diri" : {
            {data diri berdasarkan id}
        },
        "ayah": {
            {data ayah dari anggta keluarga id}
        },
        "ibu": {
            {data ibu dari anggta keluarga id}
        },
        "pasangan": {
            {data pasangan dari anggta keluarga id}
        },
        "anak": {
            {data anak dari anggta keluarga id bisa lebih dari satu}
        }
    }
}
```
## 5. Endpoint Post

### 5.1. CREATE
digunakan untuk menambahkan data anggota keluarga kedalam spreadsheet  
**Request**
```
GET [base url]
```
**body**
```JSON
{
  "api_key": "xxx",
  "action": "create",
  {isikan sesuai kebutuhan dengan key dari struktur data}
}
```
**Response**
```JSON
{
    "status": "success",
    "massage": "Sukses menambahkan data anggota keluarga",
    "data": {
        body
    }
}
```

### 5.2. UPDATE
digunakan untuk mengubah salah satu data anggota keluarga berdasarkan id
**Request**
```
GET [base url]
```
**body**
```JSON
{
  "api_key": "xxx",
  "action": "update",
  "id": "BDxxxxx"
  {isikan sesuai kebutuhan dengan key dari struktur data}
}
```
**Response**
```JSON
{
    "status": "success",
    "massage": "Sukses Mengubah data anggota keluarga",
    "data": {
        body
    }
}
```

### 5.3. DELETE
digunakan untuk menghapus salah satu data anggota keluarga berdasarkan id
**Request**
```
GET [base url]
```
**body**
```JSON
{
  "api_key": "xxx",
  "action": "delete",
  "id": "BDxxxxx"
  {isikan sesuai kebutuhan dengan key dari struktur data}
}
```
**Response**
```JSON
{
    "status": "success",
    "massage": "Sukses menghapus data anggota keluarga",
    "data": {
        body
    }
}
```

# catatan teknis
* API bersifat Stateless
* Google Spreadsheet bertindak seperti database
* Validasi dan logika bisnis dilakukan di *layer* backend
* jangan mengedit spreadsheet secara manual