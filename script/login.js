document.getElementById('logingBtn').addEventListener('click',()=>{
    const inputEmail=document.getElementById('inputEmail');
    const inputEmailValue=inputEmail.value;
    const inputPassword=document.getElementById('inputPassword')
    const inputPasswordValue=inputPassword.value;
    console.log(inputEmailValue,inputPasswordValue)

    if(inputEmailValue==='admin'&& inputPasswordValue==='admin123'){
        alert('login successful 😊')
        window.location.assign('./home.html')
    }else{
        alert('login Failed 😭 ! Place try again')
    }
})