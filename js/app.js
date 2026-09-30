const STORAGE_KEY = "ileriaKitchenV2";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const money = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value) || 0);

const VOLUME = {
  tsp: 1, tbsp: 3, "fl oz": 6, cup: 48, pint: 96, quart: 192, gallon: 768,
  ml: 0.202884, l: 202.884
};
const WEIGHT = { g: 1, kg: 1000, oz: 28.3495, lb: 453.592 };

function units() {
  return ["g","kg","oz","lb","ml","l","tsp","tbsp","fl oz","cup","pint","quart","gallon","unit"];
}

function yieldUnits() {
  return ["pieces","servings","cookies","muffins","loaves","slices","dozen","trays","cups","oz","lb","g","kg","ml","l"];
}

function convert(quantity, from, to) {
  if (from === to) return quantity;
  if (VOLUME[from] && VOLUME[to]) return quantity * VOLUME[from] / VOLUME[to];
  if (WEIGHT[from] && WEIGHT[to]) return quantity * WEIGHT[from] / WEIGHT[to];
  if (from === "unit" && to === "unit") return quantity;
  return null;
}

const ingredientSeeds = [
  ["Vegetable Oil", .31, "cup"], ["Red Onion", 2.52, "lb"], ["Red Bell Pepper", 1, "unit"],
  ["Jalapeno", .25, "unit"], ["Garlic", .75, "unit"], ["Ground Cumin", .28, "tsp"],
  ["Kosher Salt", .01, "tsp"], ["Black Beans", 1/15, "oz"], ["Corn (Ear)", .5, "unit"],
  ["Cilantro", 10.58, "cup"], ["Lime", .5, "unit"], ["Flour", .335, "cup"],
  ["Baking Soda", .02, "tsp"], ["Baking Powder", .07, "tsp"], ["Ground Ginger", .2933, "tsp"],
  ["Crystalized Ginger", .2033, "tbsp"], ["Cinnamon", .31, "tsp"], ["Ground Cardamom", .55, "tsp"],
  ["Eggs", .555, "unit"], ["Olive Oil", 4.8, "cup"], ["Light Brown Sugar", 1.06, "cup"],
  ["Granulated Sugar", .44, "cup"], ["Vanilla Extract", .91, "tsp"], ["Orange Zest", .2, "tsp"],
  ["Zucchini", 1, "unit"], ["Carrott", .5, "cup"], ["Butter", 2, "cup"],
  ["Pumpkin Puree", 3.67/15, "oz"], ["Pumpkin Spice", .9933, "tbsp"], ["Rolled Oats", .5643, "cup"],
  ["Powdered Sugar", .66, "cup"], ["Milk", 7, "gallon"], ["Apple Cider", 0, "cup"], ["Apple Pie Spice", 0, "tsp"]
];

function makeRecipe(name, category, yieldQty, laborMin, rows, yieldUnit = "pieces") {
  return {
    id: crypto.randomUUID(), name, category, yieldQty, yieldUnit,
    prepMin: laborMin, cookMin: 0, prepLabor: true, cookLabor: true,
    packaging: 0, overhead: 0, targetMargin: .33,
    rows: rows.map(([ingredient, qty, unit, importedCost]) => ({ ingredient, qty, unit, importedCost }))
  };
}

function createSeed() {
  const ingredients = ingredientSeeds.map(([name, costPerUnit, unit], index) => ({
    id: "i" + index, name, costPerUnit, unit,
    supplier: name === "Milk" ? "Temporary working price" : "Seeded from recipe reports",
    purchasePrice: name === "Milk" ? 7 : undefined,
    packageQty: name === "Milk" ? 1 : undefined,
    packageUnit: name === "Milk" ? "gallon" : undefined,
    updated: "2026-09-28"
  }));

  const recipes = [
    makeRecipe("Black Bean and Sautéed Corn","Salad",5,20,[
      ["Vegetable Oil",2,"tbsp",.15],["Red Onion",.25,"lb",.63],["Red Bell Pepper",.5,"unit",.50],
      ["Jalapeno",1,"unit",.25],["Garlic",1,"unit",.75],["Ground Cumin",.5,"tsp",.14],
      ["Kosher Salt",2,"tsp",.02],["Black Beans",15,"oz",1],["Corn (Ear)",3,"unit",1.50],
      ["Cilantro",.5,"cup",5.29],["Lime",2,"unit",1]
    ]),
    makeRecipe("Carrot Zucchini Ginger Muffin","Muffin",5,22.5,[
      ["Flour",2,"cup",.67],["Baking Soda",1,"tsp",.02],["Baking Powder",1,"tsp",.07],
      ["Ground Ginger",1.5,"tsp",.44],["Crystalized Ginger",3,"tbsp",.61],["Cinnamon",1,"tsp",.31],
      ["Ground Cardamom",.25,"tsp",.14],["Kosher Salt",.5,"tsp",.01],["Eggs",2,"unit",1.11],
      ["Olive Oil",.5,"cup",2.40],["Light Brown Sugar",.5,"cup",.53],["Granulated Sugar",.25,"cup",.11],
      ["Vanilla Extract",1,"tsp",.91],["Orange Zest",1,"tsp",.20],["Zucchini",1,"unit",1],["Carrott",1,"cup",.50]
    ]),
    makeRecipe("Pumpkin Cardamom Crumb Muffins","Muffin",6,22.5,[
      ["Flour",.75,"cup",.25],["Light Brown Sugar",.5,"cup",.53],["Ground Cardamom",1,"tsp",.55],
      ["Cinnamon",1,"tsp",.31],["Kosher Salt",1,"tsp",.01],["Butter",.5,"cup",1],
      ["Granulated Sugar",1.75,"cup",.77],["Vegetable Oil",.5,"cup",.62],["Vanilla Extract",1,"tsp",.91],
      ["Eggs",2,"unit",1.11],["Pumpkin Puree",15,"oz",3.67],["Flour",2,"cup",.67],
      ["Pumpkin Spice",3,"tbsp",2.98],["Ground Cardamom",.5,"tsp",.27]
    ]),
    makeRecipe("Pumpkin Oatmeal Cookie","Cookies",26,30,[
      ["Butter",1,"cup",2],["Light Brown Sugar",.25,"cup",.27],["Granulated Sugar",.25,"cup",.11],
      ["Pumpkin Puree",.6,"cup",.78],["Pumpkin Spice",3,"tsp",.98],["Vanilla Extract",3,"tsp",2.73],
      ["Kosher Salt",1,"tsp",.01],["Rolled Oats",1.4,"cup",.79],["Flour",1,"cup",.33],
      ["Baking Soda",.5,"tsp",.01],["Powdered Sugar",1,"cup",.66]
    ])
  ];

  const importedRecipes = (window.ILERIA_IMPORTED_RECIPES || []).map((recipe) => ({
    ...recipe,
    id: crypto.randomUUID(),
    rows: recipe.rows.map((row) => ({ ...row }))
  }));

  importedRecipes.forEach((recipe) => {
    recipe.rows.forEach((row) => {
      if (!ingredients.some((item) => item.name === row.ingredient)) {
        ingredients.push({
          id: crypto.randomUUID(),
          name: row.ingredient,
          costPerUnit: Number(row.unitCost) || 0,
          unit: row.unit || "unit",
          supplier: "Imported from Ileria Farms cost spreadsheet",
          updated: "2026-09-30"
        });
      }
    });
  });

  recipes.push(...importedRecipes);
  return { settings: { laborRate: 25, targetMargin: .33 }, ingredients, recipes };
}

function mergeSeedData(stored) {
  const seeded = createSeed();
  const merged = stored || seeded;
  merged.settings = { ...seeded.settings, ...(merged.settings || {}) };
  merged.ingredients = merged.ingredients || [];
  merged.recipes = merged.recipes || [];

  seeded.ingredients.forEach((item) => {
    if (!merged.ingredients.some((existing) => existing.name === item.name)) merged.ingredients.push(item);
  });
  seeded.recipes.forEach((recipe) => {
    if (!merged.recipes.some((existing) => existing.name === recipe.name)) merged.recipes.push(recipe);
  });
  return merged;
}

function loadDatabase() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return mergeSeedData(stored ? JSON.parse(stored) : null);
  } catch (error) {
    console.warn("Ileria Kitchen storage reset after invalid local data.", error);
    return createSeed();
  }
}

let db = loadDatabase();
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }

function ingredient(name) { return db.ingredients.find((item) => item.name === name); }

function rowCost(row) {
  if (row.costMode === "imported" && row.importedCost != null) return Number(row.importedCost) || 0;
  const item = ingredient(row.ingredient);
  if (!item) return Number(row.importedCost) || 0;
  const converted = convert(Number(row.qty), row.unit, item.unit);
  if (converted === null) return Number(row.importedCost) || 0;
  return converted * Number(item.costPerUnit || 0);
}

function calc(recipe) {
  const ingredients = recipe.rows.reduce((sum, row) => sum + rowCost(row), 0);
  const laborMinutes = (recipe.prepLabor ? Number(recipe.prepMin) : 0) + (recipe.cookLabor ? Number(recipe.cookMin) : 0);
  const labor = laborMinutes / 60 * Number(db.settings.laborRate);
  const packaging = Number(recipe.packaging) || 0;
  const overhead = Number(recipe.overhead) || 0;
  const total = ingredients + labor + packaging + overhead;
  const margin = recipe.targetMargin ?? db.settings.targetMargin;
  const sales = margin >= 1 ? 0 : total / (1 - margin);
  const profit = sales - total;
  const yieldQty = Number(recipe.yieldQty) || 1;
  return { ingredients, labor, packaging, overhead, total, unit: total/yieldQty, sales, profit, salesUnit: sales/yieldQty, profitUnit: profit/yieldQty };
}

function dashboard() {
  const calculations = db.recipes.map(calc);
  const average = calculations.length ? calculations.reduce((sum, item) => sum + item.unit, 0) / calculations.length : 0;
  const cards = [["Recipes",db.recipes.length],["Ingredients",db.ingredients.length],["Avg. unit cost",money(average)],["Labor rate",money(db.settings.laborRate)+"/hr"]];
  return '<div class="grid kpis">' + cards.map(([label,value]) => '<div class="card kpi"><span>'+label+'</span><strong>'+value+'</strong></div>').join("") +
    '</div><div class="grid two"><section class="card"><div class="section-title"><h2>Recipe costs</h2><span class="pill">Live calculations</span></div>'+recipeTable()+
    '</section><section class="card"><div class="section-title"><h2>Cost checks</h2></div><div class="list">'+
    db.ingredients.filter((item)=>!item.purchasePrice).slice(0,6).map((item)=>'<div class="list-item"><strong>'+item.name+'</strong><br><span class="muted">Seeded cost · add package price when ready</span></div>').join("")+
    '</div></section></div>';
}

function recipeTable() {
  return '<table><thead><tr><th>Recipe</th><th>Yield</th><th>Batch</th><th>Per item</th></tr></thead><tbody>'+
    db.recipes.map((recipe)=>{const c=calc(recipe);return '<tr><td><strong>'+recipe.name+'</strong><br><span class="muted">'+recipe.category+'</span></td><td>'+recipe.yieldQty+' '+recipe.yieldUnit+'</td><td>'+money(c.total)+'</td><td>'+money(c.unit)+'</td></tr>';}).join("")+
    '</tbody></table>';
}

function ingredientsView() {
  return '<div class="toolbar"><button class="primary" id="addIngredient">+ Add ingredient</button><button class="secondary" id="exportData">Export JSON</button><label class="secondary">Import JSON<input id="importData" type="file" accept=".json" hidden></label></div>'+
    '<div class="card"><table><thead><tr><th>Ingredient</th><th>Supplier</th><th>Working cost</th><th>Updated</th></tr></thead><tbody>'+
    db.ingredients.map((item)=>'<tr><td><strong>'+item.name+'</strong></td><td>'+item.supplier+'</td><td>'+money(item.costPerUnit)+' / '+item.unit+'</td><td>'+item.updated+'</td></tr>').join("")+
    '</tbody></table></div>';
}

function recipesView() {
  return '<div class="recipe-grid">'+db.recipes.map((recipe)=>{const c=calc(recipe);return '<div class="card recipe-card" data-id="'+recipe.id+'"><span class="pill">'+recipe.category+'</span><h3>'+recipe.name+'</h3><span class="muted">Makes '+recipe.yieldQty+' '+recipe.yieldUnit+'</span><div class="cost">'+money(c.unit)+'</div><span class="muted">cost per item</span></div>';}).join("")+'</div>';
}

function reportsView() {
  return '<div class="card"><div class="section-title"><h2>Recipe cost analysis</h2><span class="muted">Default margin '+Math.round(db.settings.targetMargin*100)+'%</span></div>'+
    '<table><thead><tr><th>Recipe</th><th>Ingredients</th><th>Labor</th><th>Packaging</th><th>Total cost</th><th>Sales needed</th><th>Profit</th></tr></thead><tbody>'+
    db.recipes.map((recipe)=>{const c=calc(recipe);return '<tr><td><strong>'+recipe.name+'</strong></td><td>'+money(c.ingredients)+'</td><td>'+money(c.labor)+'</td><td>'+money(c.packaging)+'</td><td>'+money(c.total)+'</td><td>'+money(c.sales)+'</td><td>'+money(c.profit)+'</td></tr>';}).join("")+
    '</tbody></table></div>';
}

function settingsView() {
  return '<div class="card" style="max-width:650px"><h2>Costing settings</h2><div class="form-grid"><div><label>Labor rate ($ / hour)</label><input id="laborRate" type="number" step=".01" value="'+db.settings.laborRate+'"></div><div><label>Default profit margin (%)</label><input id="targetMargin" type="number" min="0" max="99" value="'+db.settings.targetMargin*100+'"></div></div><p class="muted">New recipes begin with this margin. Existing recipes can override it individually.</p><button class="primary" id="saveSettings">Save settings</button></div>';
}

const views = { dashboard, ingredients: ingredientsView, recipes: recipesView, reports: reportsView, planning: window.planningView, actionplan: window.actionPlanView, settings: settingsView };
const titles = { dashboard:"Kitchen Dashboard", ingredients:"Ingredient Library", recipes:"Recipes", reports:"Cost Reports", planning:"October Content Calendar", actionplan:"Content & Growth Action Plan", settings:"Settings" };

function render(view = "dashboard") {
  $$("#nav button").forEach((button)=>button.classList.toggle("active", button.dataset.view === view));
  $("#pageTitle").textContent = titles[view];
  $("#newRecipe").style.display = (view === "settings" || view === "planning" || view === "actionplan") ? "none" : "";
  $("#app").innerHTML = views[view]();
  bind(view);
}

function closeModal() { $("#modal").classList.add("hidden"); }

function ingredientModal() {
  $("#modalBody").innerHTML = '<p class="eyebrow">INGREDIENT LIBRARY</p><h2>Add Ingredient</h2><div class="form-grid">'+
    '<div><label>Name</label><input id="iName"></div><div><label>Supplier / Store</label><input id="iSupplier"></div>'+
    '<div><label>Purchase price ($)</label><input id="iPrice" type="number" step=".01"></div><div><label>Package quantity</label><input id="iQty" type="number" step=".001"></div>'+
    '<div><label>Package unit</label><select id="iUnit">'+units().map((unit)=>'<option>'+unit+'</option>').join("")+'</select></div><div><label>Price date</label><input id="iDate" type="date"></div></div>'+
    '<p class="muted">Working unit cost is derived from package price and size.</p><button class="primary" id="saveIngredient">Save ingredient</button>';
  $("#modal").classList.remove("hidden");
  $("#iDate").value = new Date().toISOString().slice(0,10);
  $("#saveIngredient").onclick = () => {
    const price=Number($("#iPrice").value), qty=Number($("#iQty").value), unit=$("#iUnit").value;
    db.ingredients.push({id:crypto.randomUUID(),name:$("#iName").value,supplier:$("#iSupplier").value,purchasePrice:price,packageQty:qty,packageUnit:unit,unit,costPerUnit:qty?price/qty:0,updated:$("#iDate").value});
    save(); closeModal(); render("ingredients");
  };
}

function rowHTML(row = null) {
  const value = row || { ingredient: db.ingredients[0]?.name || "", qty:1, unit:"cup" };
  return '<div class="ingredient-row"><div><label>Ingredient</label><select class="ri">'+db.ingredients.map((item)=>'<option '+(item.name===value.ingredient?'selected':'')+'>'+item.name+'</option>').join("")+
    '</select></div><div><label>Qty</label><input class="rq" type="number" step=".001" value="'+value.qty+'"></div><div><label>Unit</label><select class="ru">'+
    units().map((unit)=>'<option '+(unit===value.unit?'selected':'')+'>'+unit+'</option>').join("")+
    '</select></div><div class="muted rc"></div><button class="danger removeRow">×</button></div>';
}

function recipeModal(existing) {
  const recipe = existing ? JSON.parse(JSON.stringify(existing)) : {
    id:crypto.randomUUID(), name:"", category:"", yieldQty:1, yieldUnit:"pieces",
    prepMin:0, cookMin:0, prepLabor:true, cookLabor:true, packaging:0, overhead:0,
    targetMargin:db.settings.targetMargin, rows:[]
  };

  $("#modalBody").innerHTML = '<p class="eyebrow">RECIPE BUILDER</p><h2>'+(existing?"Edit":"New")+' Recipe</h2><div class="form-grid">'+
    '<div><label>Name</label><input id="rName" value="'+recipe.name+'"></div><div><label>Category</label><input id="rCat" value="'+recipe.category+'"></div>'+
    '<div><label>Batch yield</label><input id="rYield" type="number" min=".001" step=".001" value="'+(recipe.yieldQty ?? "")+'"></div>'+
    '<div><label>Yield unit</label><select id="rYieldUnit">'+yieldUnits().map((unit)=>'<option '+(unit===recipe.yieldUnit?'selected':'')+'>'+unit+'</option>').join("")+'</select></div>'+
    '<div><label>Prep minutes</label><input id="rPrep" type="number" min="0" value="'+(recipe.prepMin ?? "")+'"><label><input id="rPrepLabor" type="checkbox" style="width:auto" '+(recipe.prepLabor?'checked':'')+'> counts as labor</label></div>'+
    '<div><label>Cook minutes</label><input id="rCook" type="number" min="0" value="'+(recipe.cookMin ?? "")+'"><label><input id="rCookLabor" type="checkbox" style="width:auto" '+(recipe.cookLabor?'checked':'')+'> counts as labor</label></div>'+
    '<div><label>Packaging / batch ($)</label><input id="rPackaging" type="number" min="0" step=".01" value="'+(recipe.packaging ?? "")+'"></div>'+
    '<div><label>Desired profit margin (%)</label><input id="rMargin" type="number" min="0" max="99" step="1" value="'+Math.round((recipe.targetMargin ?? db.settings.targetMargin)*100)+'"></div></div>'+
    '<h3>Ingredients</h3><div id="rows">'+recipe.rows.map(rowHTML).join("")+'</div><button class="secondary" id="addRow">+ Add ingredient</button>'+
    '<div class="summary" id="liveSummary"></div><div style="display:flex;justify-content:flex-end;gap:8px;margin-top:18px">'+
    (existing?'<button class="danger" id="deleteRecipe">Delete</button>':'')+'<button class="primary" id="saveRecipe">Save recipe</button></div>';

  $("#modal").classList.remove("hidden");

  function collect() {
    const numberOrNull = (selector) => $(selector).value === "" ? null : Number($(selector).value);
    recipe.name=$("#rName").value; recipe.category=$("#rCat").value; recipe.yieldQty=numberOrNull("#rYield");
    recipe.yieldUnit=$("#rYieldUnit").value; recipe.prepMin=numberOrNull("#rPrep"); recipe.cookMin=numberOrNull("#rCook");
    recipe.prepLabor=$("#rPrepLabor").checked; recipe.cookLabor=$("#rCookLabor").checked; recipe.packaging=numberOrNull("#rPackaging");
    recipe.targetMargin=Number($("#rMargin").value)/100;
    recipe.rows=$("#rows .ingredient-row").map((el)=>({ingredient:el.querySelector(".ri").value,qty:el.querySelector(".rq").value===""?null:Number(el.querySelector(".rq").value),unit:el.querySelector(".ru").value}));
    return recipe;
  }

  function live() {
    const c=calc(collect());
    $$("#rows .ingredient-row").forEach((el,index)=>{el.querySelector(".rc").textContent=money(rowCost(recipe.rows[index]));});
    $("#liveSummary").innerHTML =
      '<div><span>Ingredients</span><strong>'+money(c.ingredients)+'</strong></div>'+
      '<div><span>Labor</span><strong>'+money(c.labor)+'</strong></div>'+
      '<div><span>Packaging</span><strong>'+money(c.packaging)+'</strong></div>'+
      '<div><span>Total cost</span><strong>'+money(c.total)+'</strong></div>'+
      '<div><span>Sales needed</span><strong>'+money(c.sales)+'</strong></div>'+
      '<div><span>Total profit</span><strong>'+money(c.profit)+'</strong></div>'+
      '<div><span>Sell each for</span><strong>'+money(c.salesUnit)+'</strong></div>'+
      '<div><span>Profit / item</span><strong>'+money(c.profitUnit)+'</strong></div>';
  }

  $("#modalBody").oninput=live;
  $("#modalBody").onchange=live;
  $("#addRow").onclick=()=>{$("#rows").insertAdjacentHTML("beforeend",rowHTML());live();};
  $("#rows").onclick=(event)=>{if(event.target.classList.contains("removeRow")){event.target.closest(".ingredient-row").remove();live();}};
  $("#saveRecipe").onclick=()=>{collect();const index=db.recipes.findIndex((item)=>item.id===recipe.id);if(index>=0)db.recipes[index]=recipe;else db.recipes.push(recipe);save();closeModal();render("recipes");};
  if(existing) $("#deleteRecipe").onclick=()=>{db.recipes=db.recipes.filter((item)=>item.id!==recipe.id);save();closeModal();render("recipes");};
  live();
}

function bind(view) {
  $("#newRecipe").onclick=()=>recipeModal();
  if(view==="planning") window.bindPlanning();
  if(view==="recipes") $$(".recipe-card").forEach((card)=>{card.onclick=()=>recipeModal(db.recipes.find((recipe)=>recipe.id===card.dataset.id));});
  if(view==="ingredients") {
    $("#addIngredient").onclick=ingredientModal;
    $("#exportData").onclick=()=>{const link=document.createElement("a");link.href=URL.createObjectURL(new Blob([JSON.stringify(db,null,2)],{type:"application/json"}));link.download="ileria-kitchen-backup.json";link.click();};
    $("#importData").onchange=(event)=>{const reader=new FileReader();reader.onload=()=>{try{db=JSON.parse(reader.result);save();render("ingredients");}catch(error){alert("That JSON backup could not be read.");}};reader.readAsText(event.target.files[0]);};
  }
  if(view==="settings") $("#saveSettings").onclick=()=>{db.settings.laborRate=Number($("#laborRate").value);db.settings.targetMargin=Number($("#targetMargin").value)/100;save();render("settings");};
}

$("#nav").onclick=(event)=>{const button=event.target.closest("[data-view]");if(button)render(button.dataset.view);};
$("#closeModal").onclick=closeModal;
$("#modal").onclick=(event)=>{if(event.target.id==="modal")closeModal();};

render("dashboard");
