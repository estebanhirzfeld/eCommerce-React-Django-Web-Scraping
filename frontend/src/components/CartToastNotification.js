import './styles/CartToastNotification.css'

function CartToastNotification() {
    var x = document.getElementById("toast")
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
}

export default CartToastNotification