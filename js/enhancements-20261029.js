/* Ileria Kitchen enhancements: ingredient editing, ordering, sales tax. */
(function(){
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const oldIngredients=ingredientsView;
ingredientsView=function(){
 const html=oldIngredients();
 return html.replace('<th>Updated</th>','<th>Updated</th><th>Actions</th>').replace(/<\/tr>/g,'</tr>').replace('<tbody>'+db.ingredients.map((item)=>'<tr><td><strong>'+item.name+'</strong></td><td>'+item.supplier+'</td><td>'+money(item.costPerUnit)+' / '+item.unit+'</td><td>'+item.updated+'</td></tr>').join("")+'</tbody>',
 '<tbody>'+[...db.ingredients].sort((a,b)=>a.name.localeCompare(b.name,undefined,{sensitivity:"base"})).map(item=>'<tr><td><strong>'+esc(item.name)+'</strong></td><td>'+esc(item.supplier)+'</td><td>'+money(item.costPerUnit)+' / '+esc(item.unit)+'</td><td>'+esc(item.updated)+'</td><td><button class="secondary ingredientEdit" data-id="'+esc(item.id)+'">Edit</button></td></tr>').join("")+'</tbody>');
};
const originalBind=bind;
bind=function(view){originalBind(view);if(view==="ingredients")document.querySelectorAll(".ingredientEdit").forEach(b=>b.onclick=()=>editIngredient(b.dataset.id));};
function editIngredient(id){
 const item=db.ingredients.find(x=>x.id===id);if(!item)return;
 ingredientModal();
 document.querySelector("#modalBody h2").textContent="Edit Ingredient";
 const set=(id,v)=>document.querySelector(id).value=v??"";
 set("#iName",item.name);set("#iSupplier",item.supplier);set("#iPrice",item.purchasePrice??item.costPerUnit);set("#iQty",item.packageQty??1);
 set("#iUnit",item.packageUnit||item.unit);set("#iDate",item.updated);
 document.querySelector("#saveIngredient").onclick=()=>{
 const name=document.querySelector("#iName").value.trim(),qty=Number(document.querySelector("#iQty").value),price=Number(document.querySelector("#iPrice").value);
 if(!name||!(qty>0)||price<0){alert("Enter a name, valid purchase price and package quantity greater than zero.");return;}
 if(db.ingredients.some(x=>x.id!==id&&x.name.toLowerCase()===name.toLowerCase())){alert("An ingredient with that name already exists.");return;}
 const old=item.name;
 Object.assign(item,{name,supplier:document.querySelector("#iSupplier").value,purchasePrice:price,packageQty:qty,packageUnit:document.querySelector("#iUnit").value,unit:document.querySelector("#iUnit").value,costPerUnit:price/qty,updated:document.querySelector("#iDate").value});
 if(old!==name)db.recipes.forEach(r=>r.rows.forEach(row=>{if(row.ingredient===old)row.ingredient=name;}));
 save();closeModal();render("ingredients");
 };
}
const oldRecipeModal=recipeModal;
recipeModal=function(existing){
 oldRecipeModal(existing);
 const anchor=document.querySelector("#rActualPrice").parentElement;
 anchor.insertAdjacentHTML("afterend",'<div><label><input type="checkbox" id="rSalesTax" style="width:auto" '+(existing?.salesTax?'checked':'')+'> Add 10% sales tax at checkout</label><small class="muted">Tax is collected separately, not counted as profit.</small></div>');
 const originalSave=document.querySelector("#saveRecipe").onclick;
 document.querySelector("#saveRecipe").onclick=e=>{const checked=document.querySelector("#rSalesTax").checked;originalSave(e);const r=db.recipes.find(x=>x.id===(existing?.id||db.recipes.at(-1)?.id));if(r){r.salesTax=checked;save();}};
 const summary=document.querySelector("#liveSummary");
 const refresh=()=>{const price=Number(document.querySelector("#rActualPrice").value||0),tax=document.querySelector("#rSalesTax").checked;let el=document.querySelector("#taxPreview");if(!el){summary.insertAdjacentHTML("beforeend",'<div id="taxPreview"></div>');el=document.querySelector("#taxPreview");}el.innerHTML='<span>Customer total / item (incl. tax)</span><strong>'+money(price*(tax?1.1:1))+'</strong>';};
 document.querySelector("#modalBody").addEventListener("input",refresh);document.querySelector("#modalBody").addEventListener("change",refresh);refresh();
};
})();
