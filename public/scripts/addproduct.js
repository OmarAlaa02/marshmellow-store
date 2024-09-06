document.getElementById('submit-button').addEventListener('click', function() {
    const form = document.getElementById('product-form');
    const formData = new FormData(form);

    
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    fetch('/admin/addproduct', {
        method: 'POST',
        headers: {
            'X-CSRF-Token': csrfToken, 
        },
        body: formData 
    })
    .then(data => {
        window.location.href = '/admin/home'; 
        
    })
    
});