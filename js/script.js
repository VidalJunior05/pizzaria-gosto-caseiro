let cartPizzas = [];
let qtPizzasModal  = 1;
let modalkey = 0;

//Otimizando o código, através da criação de um atalho para quando eu for usar o document.querySelector e o document.querySelectorAll
const docQuery = (el)=> document.querySelector(el);
const querySAll = (el)=> document.querySelectorAll(el);

//LISTAGEM DAS PIZZAS
pizzaJson.map((itemPizza, index)=>{
    let pizzaItem = docQuery('.models .pizza-item').cloneNode(true);
    
    pizzaItem.setAttribute('data-key',index);

    pizzaItem.querySelector('.pizza-item--img img').src = itemPizza.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${itemPizza.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = itemPizza.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = itemPizza.description;
    
    pizzaItem.querySelector('.pizza-item a').addEventListener('click', (e)=> {
        e.preventDefault();
        //Adicionando a pizza clicada ao modal
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        
        qtPizzasModal = 1;
        modalkey = key;
    

        docQuery('.pizzaBig img').src = pizzaJson[key].img;
        docQuery('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        docQuery('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        docQuery('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        
        //Desselecionar os tamanhos das Pizzas
        docQuery('.pizzaInfo--size.selected').classList.remove('selected');
       
        querySAll('.pizzaInfo--size').forEach((itemSize, sizeIndex)=> {
            if(sizeIndex == 2){
                itemSize.classList.add('selected');
            }
            itemSize.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        docQuery('.pizzaInfo--qt').innerHTML = qtPizzasModal;

        //Efeito de opacidade no modal
        docQuery('.pizzaWindowArea').style.opacity = 0;
        docQuery('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            docQuery('.pizzaWindowArea').style.opacity = 1;
        }, 200);

    });
    docQuery('.pizza-area').append(pizzaItem);

});
function closeModalPizza(){
    docQuery('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        docQuery('.pizzaWindowArea').style.display = 'none'; 
    },500)
      
}
querySAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((itemModal)=>{
    itemModal.addEventListener('click', closeModalPizza);
});
//Ações dos Botões da Quantidade de Pizzas
docQuery('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(qtPizzasModal > 1 ){
        qtPizzasModal--;
        docQuery('.pizzaInfo--qt').innerHTML = qtPizzasModal;
    }
});
docQuery('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    qtPizzasModal++;
    docQuery('.pizzaInfo--qt').innerHTML = qtPizzasModal;
});
//Eventos de selecionar os tamanhos das pizzas,e  add a classe selected a quem eu clicar
querySAll('.pizzaInfo--size').forEach((itemSize, sizeIndex)=> {
    itemSize.addEventListener('click', (e)=>{
        docQuery('.pizzaInfo--size.selected').classList.remove('selected');
        itemSize.classList.add('selected');
    });
});
//Adiconado ao itens ao carrinho
docQuery('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(docQuery('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalkey].id +'#'+size;
    let key = cartPizzas.findIndex((item) => {
        return item.identifier == identifier;
    });
    
    if(key > -1){
        cartPizzas[key].qt += qtPizzasModal;
    }else{
        cartPizzas.push({
            identifier,
            id:pizzaJson[modalkey].id,
            size,
            qt:qtPizzasModal
        });
    }
    updateCartPizza();
    closeModalPizza();
});
docQuery('.menu-openner').addEventListener('click',()=>{
    if(cartPizzas.length > 0){
        docQuery('aside').style.left = '0';
    }else{
        //Adicionando mensagem quando o carrinho estiver vazio.
        $(".alert-cart-zero").show();
        setTimeout( ()=> {
        $(".alert-cart-zero").hide();
        }, 3000);
    }
});

//Fechar Menu Mobile 
docQuery('.menu-closer').addEventListener('click',()=>{
    docQuery('aside').style.left = '100vw';
})
function updateCartPizza() {
    docQuery('.menu-openner span').innerHTML = cartPizzas.length;
    
    if(cartPizzas.length > 0){
       docQuery('aside').classList.add('show');
       docQuery('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        let delivery = 10;

        for(let i in cartPizzas){
            let pizzaItem = pizzaJson.find((item)=>item.id == cartPizzas[i].id);
            subtotal += pizzaItem.price * cartPizzas[i].qt;

            let cartItem = docQuery('.models .cart--item').cloneNode(true);
        
            let pizzaSizeName;
            switch(cartPizzas[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src= pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cartPizzas[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cartPizzas[i].qt > 1){
                    cartPizzas[i].qt--;
                }else{
                    cartPizzas.splice(i, 1); 
                }
                updateCartPizza();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cartPizzas[i].qt++;
                updateCartPizza();
            });
            docQuery('.cart').append(cartItem);
        }
        desconto = subtotal * 0.1;
        total = (delivery + subtotal) - desconto;

        docQuery('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2  )}`;
        docQuery('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2  )}`;
        docQuery('.total span:last-child').innerHTML = `R$ ${total.toFixed(2  )}`;
    }else{
        docQuery('aside').classList.remove('show');
        docQuery('aside').style.left = '100vw';
    }
}
