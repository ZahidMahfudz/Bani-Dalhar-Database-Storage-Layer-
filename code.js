const SHEET_NAME = "daftar_keluarga";

function getSheet() {
  return SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(SHEET_NAME);
}

function getApiKey() {
  return PropertiesService
    .getScriptProperties()
    .getProperty('API_KEY');
}

/* =========================
   RESPONSE HELPER
========================= */
function successResponse(massage, data) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      massage: massage,
      data: data
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function errorResponse(message) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'error',
      message: message
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* =========================
   VALIDASI API KEY (GET)
========================= */
function validateApiKeyGet(e) {
  const clientKey = e.parameter.api_key;

  if (!clientKey) {
    return errorResponse('API Key tidak ditemukan');
  }

  if (clientKey !== getApiKey()) {
    return errorResponse('API Key tidak valid');
  }

  return null;
}

/* =========================
   VALIDASI API KEY (POST)
========================= */
function validateApiKeyPost(body) {
  if (!body.api_key) {
    return errorResponse('API Key tidak ditemukan');
  }

  if (body.api_key !== getApiKey()) {
    return errorResponse('API Key tidak valid');
  }

  return null;
}

/* =========================
   FUNCTION FOR doGET
========================= */

function getAll() {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();

  if (values.length < 2) return [];

  const headers = values[0];
  const rows = values.slice(1);

  return rows.map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function getById(id) {
  if (!id) return errorResponse("Parameter id tidak ditemukan");

  const data = getAll();
  const found = data.find(d => d.person_id === id);

  if (!found) return errorResponse("Data tidak ditemukan");

  return found;
}


function getFamily(id) {
  if (!id) return errorResponse("Parameter id tidak ditemukan")

  const data = getAll();
  const person = data.find(d => d.person_id === id);

  if (!person) return errorResponse("Data Tidak Ditemukan");

  const family = {
    diri: person,
    ayah: data.find(d => d.person_id === person.ayah_id) || null,
    ibu: data.find(d => d.person_id === person.ibu_id) || null,
    pasangan: data.find(d => d.person_id === person.pasangan_id) || null,
    anak: data.filter(d => d.ayah_id === id || d.ibu_id === id)
  };

  return family
}

/* =========================
   FUNCTION FOR doPost
========================= */
function createPerson(body) {
  const sheet = getSheet();
  const headers = sheet.getDataRange().getValues()[0];

  const row = headers.map(h => body[h] || "");
  sheet.appendRow(row);

  return row
}

function updatePerson(body) {
  if (!body.person_id) return errorResponse("Parameter id tidak ditemukan");

  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const rowIndex = data.findIndex(r => r[0] === body.person_id);
  if (rowIndex === -1) return errorResponse("Data tidak ditemukan");

  headers.forEach((h, i) => {
    if (body[h] !== undefined) {
      sheet.getRange(rowIndex + 1, i + 1).setValue(body[h]);
    }
  });

  return body
}

function deletePerson(body) {
  if (!body.person_id) return errorResponse("Parameter id tidak ditemukan");

  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();

  const rowIndex = data.findIndex(r => r[0] === body.person_id);
  if (rowIndex === -1) return errorResponse("Data tidak ditemukan");

  sheet.deleteRow(rowIndex + 1)

  return body
}



/* =========================
   READ (GET) - PARAMS
========================= */
function doGet(e) {
  try{
    const auth = validateApiKeyGet(e);
    if (auth) return auth;

    const action = e.parameter.action || "ping";

    switch (action) {
      case "ping":
        return successResponse({massage : "API Google Apps Script Bani Dalhar Sukses Aktif"}, null);
      
      case "getAll":
        return successResponse("Sukses mengambil semua data keluarga", getAll());

      case "getById":
        return successResponse("Sukses mengambil semua data berdasarkan id", getById(e.parameter.id));

      case "getFamily":
        return successResponse("Sukses mengambil semua data keluarga berdasarkan id", getFamily(e.parameter.id))

      default:
        return errorResponse("Action Tidak Valid") 
    }
  } catch (error) {
      return errorResponse(error.massage)
  }
}

/* =========================
   CREATE, UPDATE, DELETE (POST) - Body
========================= */
function doPost(e) {
  try{
    const body = JSON.parse(e.postData.contents);

    const auth = validateApiKeyPost(body)
    if (auth) return auth

    const action = body.action

    switch (action) {
      case "create":
        return successResponse("Sukses menambahkan data anggota keluarga", createPerson(body));

      case "update":
        return successResponse("Sukses mengubah data anggota keluarga", updatePerson(body));

      case "delete":
        return successResponse("Sukses menghapus data anggota keluarga", deletePerson(body));

      default:
        return errorResponse("Action Tidak Valid")
    }

  } catch (error) {
      return errorResponse(err.massage);
  }
}


