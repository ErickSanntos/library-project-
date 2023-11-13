var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var check= document.getElementsByClassName("fa-check");

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('messages', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(check).forEach(function(element) {
  element.addEventListener('click', function() {
      // Use closest() to find the nearest ancestor which is an li element
      const listItem = this.closest('li.message');
      const isbn = listItem.getAttribute('data-isbn');

      console.log(isbn); // Now it should log the correct ISBN

      // Proceed with the fetch request
      fetch('/books', {
          method: 'delete',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              'isbn': isbn
          })
      }).then(function(response) {
          window.location.reload();
      });
  });
});

