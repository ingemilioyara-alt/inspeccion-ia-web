/************* UTILIDADES *************/
const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function show(el){ el.classList.remove('hidden'); }
function hide(el){ el.classList.add('hidden'); }

function go(viewId, titleText){
  // topbar visible en todas menos login
  if (viewId === '#view-login') {
    hide($('#topbar'));
  } else {
    show($('#topbar'));
    $('#topbar-title').textContent = titleText || 'INSPECTIA-Web';
  }
  // ocultar todas
  ['#view-login','#view-dashboard','#view-registro','#view-detalle','#view-reportes']
    .forEach(id => hide($(id)));
  // mostrar destino
  show($(viewId));
}

/************* LOGIN *************/
$('#loginForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const u = $('#usuario').value.trim();
  const p = $('#clave').value;

  let role = null;
  if (u === 'Admin' && p === '1234') role = 'Admin';
  if (u === 'Operador' && p === '5678') role = 'Operador';

  if (role){
    try { sessionStorage.setItem('role', role); } catch {}
    $('#userRoleText').textContent = role;
    go('#view-dashboard', 'Panel de Control');
  } else {
    alert('Usuario o contraseña incorrectos ❌');
  }
});

$('#forgotBtn')?.addEventListener('click', ()=> alert('Función de recuperación aún no implementada 🔧'));

/************* TOPBAR (usuario) *************/
(function initUserMenu(){
  const role = sessionStorage.getItem('role');
  if (role) $('#userRoleText').textContent = role;

  const btn = $('#userMenuBtn');
  const menu = $('#userMenu');
  if (!btn) return;

  btn.addEventListener('click', (e)=>{
    e.stopPropagation();
    menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', menu.classList.contains('is-open') ? 'true' : 'false');
  });

  document.addEventListener('click', (e)=>{
    if (!menu.contains(e.target) && !btn.contains(e.target)){
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  $('#logoutBtn').addEventListener('click', ()=>{
    try { sessionStorage.removeItem('role'); } catch {}
    // limpiar campos de login si vuelven
    $('#usuario') && ($('#usuario').value = '');
    $('#clave') && ($('#clave').value = '');
    go('#view-login', 'INSPECTIA-Web');
  });
})();

/************* NAVEGACIÓN DASHBOARD *************/
$('#goRegistro')?.addEventListener('click', ()=>{
  go('#view-registro', 'INSPECTIA-Web');
});
$('#goReportes')?.addEventListener('click', ()=>{
  go('#view-reportes', 'INSPECTIA-Web');
});

/************* REGISTRO: Carga de imagen y detección *************/
const fileInput = $('#fileInput');
const previewImg = $('#previewImg');
const uploadHint = $('#uploadHint');
const resultadoDetect = $('#resultadoDetect');
let fotoBase64 = null;

fileInput?.addEventListener('change', (e)=>{
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev)=>{
    fotoBase64 = ev.target.result;
    previewImg.src = fotoBase64;
    previewImg.classList.remove('hidden');
    uploadHint.classList.add('hidden');
  };
  reader.readAsDataURL(file);
});

$('#btnDetectar')?.addEventListener('click', ()=>{
  if (!fileInput.files?.length){
    alert('Sube una foto antes de detectar.');
    return;
  }
  resultadoDetect.value = '';
  $('#btnDetectar').disabled = true;
  $('#btnDetectar').textContent = 'Detectando…';

  // Simulación IA con delay
  setTimeout(()=>{
    const result = Math.random() < 0.5 ? 'Con_Tapa' : 'Sin_Tapa';
    resultadoDetect.value = result;
    $('#btnDetectar').disabled = false;
    $('#btnDetectar').textContent = 'Detectar';
  }, 1200);
});

// ====== REGISTRAR INSPECCIÓN (guardar SIN foto en localStorage) ======
document.getElementById('btnRegistrar')?.addEventListener('click', ()=>{
  const linea = document.getElementById('lineaSelect').value;
  const rol   = sessionStorage.getItem('role') || 'Operador';

  if (!linea){ alert('Selecciona la línea de producción.'); return; }
  if (!fotoBase64){ alert('Sube una imagen.'); return; }
  if (!resultadoDetect.value){ alert('Primero ejecuta la detección.'); return; }

  const now   = new Date();
  const fecha = now.toISOString().slice(0,10).replaceAll('-','/'); // YYYY/MM/DD
  const hora  = now.toTimeString().slice(0,5);                     // HH:MM
  const turno = calcularTurno(now);

  // Objeto que sí guardamos (sin foto, para no exceder localStorage)
  const registro = {
    id: 'INS-' + now.getTime(),
    fecha,
    hora,
    linea,
    turno,
    operador: (rol === 'Admin' ? 'Admin' : 'Operador'),
    resultado: resultadoDetect.value
  };

  // Guardar en localStorage
  const key = 'inspecciones';
  const lista = JSON.parse(localStorage.getItem(key) || '[]');
  lista.push(registro);
  try {
    localStorage.setItem(key, JSON.stringify(lista));
  } catch (err) {
    console.error('No se pudo guardar en localStorage:', err);
    alert('Aviso: el almacenamiento del navegador está lleno.');
  }

  // Ir al DETALLE con la foto solo en memoria
  cargarDetalle({ ...registro, foto: fotoBase64 });
  go('#view-detalle', 'INSPECTIA-Web');

  // Limpiar formulario
  document.getElementById('lineaSelect').value = '';
  document.getElementById('fileInput').value = '';
  fotoBase64 = null;
  document.getElementById('previewImg').classList.add('hidden');
  document.getElementById('uploadHint').classList.remove('hidden');
  resultadoDetect.value = '';
});

function calcularTurno(date){
  const h = date.getHours();
  if (h >= 6 && h < 14) return 'Mañana';
  if (h >= 14 && h < 22) return 'Tarde';
  return 'Noche';
}

/************* DETALLE: Cargar y finalizar *************/
function cargarDetalle(data){
  $('#detalleFoto').src = data.foto;
  $('#det-fecha').value = data.fecha;
  $('#det-hora').value = data.hora;
  $('#det-linea').value = data.linea;
  $('#det-operador').value = data.operador;
  $('#det-resultado').value = data.resultado;
}

$('#btnFinalizar')?.addEventListener('click', ()=>{
  // Volver al Panel de Control
  go('#view-dashboard', 'Panel de Control');
});

/************* REPORTES *************/
$('#btnGenerar')?.addEventListener('click', ()=>{
  const key = 'inspecciones';
  const lista = JSON.parse(localStorage.getItem(key) || '[]');

  const fTurno = $('#filtroTurno').value;   // '' ó Mañana/Tarde/Noche
  const fLinea = $('#filtroLinea').value;   // '' ó 1/2/3
  const desde  = $('#filtroDesde').value;   // 'YYYY-MM-DD'
  const hasta  = $('#filtroHasta').value;   // 'YYYY-MM-DD'

  const rows = lista.filter(item=>{
    let ok = true;

    // Filtro turno
    if (fTurno && item.turno !== fTurno) ok = false;

    // Filtro línea
    if (fLinea && String(item.linea) !== String(fLinea)) ok = false;

    // Filtro fechas (conversión a YYYY-MM-DD)
    const itemDate = item.fecha.replaceAll('/','-'); // YYYY-MM-DD
    if (desde && itemDate < desde) ok = false;
    if (hasta && itemDate > hasta) ok = false;

    return ok;
  });

  pintarTabla(rows);
});

function pintarTabla(data){
  const tbody = $('#tablaReportes tbody');
  tbody.innerHTML = '';
  if (!data.length){
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#666;">Sin resultados</td></tr>';
    return;
  }
  data.forEach(row=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.fecha}</td>
      <td>${row.hora}</td>
      <td>${row.linea}</td>
      <td>${row.turno}</td>
      <td>${row.operador}</td>
      <td>${row.resultado}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ************* EXPORTAR A EXCEL (CSV compatible con Excel en español) *************
document.getElementById('btnExportar')?.addEventListener('click', function () {
  var table = document.getElementById('tablaReportes');
  if (!table) { alert('No existe la tabla de reportes.'); return; }

  var headers = Array.from(table.querySelectorAll('thead th')).map(function (th) {
    return th.textContent.trim();
  });
  var rows = Array.from(table.querySelectorAll('tbody tr')).map(function (tr) {
    return Array.from(tr.children).map(function (td) {
      return td.textContent.trim();
    });
  });

  if (rows.length === 0) {
    alert('No hay datos para exportar. Genera el reporte primero.');
    return;
  }

  // Excel (ES) suele usar ; como delimitador
  var DELIM = ';';
  var EOL   = '\r\n';
  function esc(v) { return '"' + String(v).replace(/"/g, '""') + '"'; }

  // Construir CSV: encabezados + filas
  var lines = [];
  lines.push(headers.map(esc).join(DELIM));
  rows.forEach(function (r) { lines.push(r.map(esc).join(DELIM)); });
  var csv = lines.join(EOL);

  // BOM UTF-8 para que Excel respete acentos/ñ
  var BOM = '\uFEFF';
  var blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
  var url  = URL.createObjectURL(blob);

  var a = document.createElement('a');
  a.href = url;
  var dateStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  a.download = 'reporte_inspecciones_' + dateStr + '.csv';

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

/************* ARRANQUE: si hay sesión, ir al Dashboard *************/
window.addEventListener('DOMContentLoaded', ()=>{
  const role = sessionStorage.getItem('role');
  if (role){
    $('#userRoleText').textContent = role;
    go('#view-dashboard', 'Panel de Control');
  } else {
    go('#view-login', 'INSPECTIA-Web');
  }
});
