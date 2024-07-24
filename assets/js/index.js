const moneyToConvert= document.getElementById('moneyToConvert')
const chartDiv=document.getElementById('chartDiv')
const button=document.getElementById('button')
const conversionResult=document.getElementById('conversionResult')
const errorContainer=document.getElementById('error-container')


async function convertCurrency(money){
  try{
    const currencySelected=document.getElementById('currencySelected').value
    const res= await fetch ("https://mindicador.cl/api");
    if (res.status == 200) {
        const data = await res.json();
        switch (currencySelected){
          case 'dolar':
            conversionResult.innerHTML='$ '
            break;
          case 'uf':
            conversionResult.innerHTML=' '
            break;
          case 'euro':
            conversionResult.innerHTML='€ '
            break;
          }
        conversionResult.innerHTML+=Math.round((money/data[currencySelected].valor) * 100) / 100;
        if(currencySelected ==='uf') conversionResult.innerHTML+= ' UF';
    
        await lookForData(currencySelected);
      } else {
        //NOTIFICATION OF ERROR
        errorContainer.innerHTML=`<div class="alert alert-danger alert-dismissible" role="alert">
        <div>"Error 404: No encontrado"</div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
        
      }
    } catch(err){
      //NOTIFICATION OF ERROR
      errorContainer.innerHTML=`<div class="alert alert-danger alert-dismissible" role="alert">
      <div>"Debes selecionar la divisa"</div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
  }
}

button.addEventListener('click',(e)=>{
  e.preventDefault()
  if(moneyToConvert.value==""){
    //NOTIFICATION OF ERROR
    errorContainer.innerHTML=`<div class="alert alert-danger alert-dismissible" role="alert">
    <div>"Enter quantity"</div><button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
  } else{

  convertCurrency(moneyToConvert.value)
  errorContainer.innerHTML=""
}})


// Selection of the price currency of the last 10 days
async function lookForData(currency){
  try{
    const res= await fetch (`https://mindicador.cl/api/${currency}`);
    const data=await res.json();
    const lastTenDays= data.serie.slice(0,10).reverse()
        
    let points=lastTenDays.map(day=>{
      return {y:day.valor, label:day.fecha.slice(0,10)}
    })

    let chart = new CanvasJS.Chart("chartDiv",{
      title:{
      text: "Historial últimos 10 días"
      },
      axisX:{
        title: "Últimos días",
      },
      axisY:{
        title: `Valor diario de: ${currency}`,
      },
      data: [{
        type: "line",
        dataPoints: points
      }]
    });

    chart.render();
    

  } catch(err){
    console.log("catch",err)
  }
}



