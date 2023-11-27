var trash = document.getElementsByClassName("fa-trash");
var check= document.getElementsByClassName("fa-check");



Array.from(check).forEach(function(element) {
    element.addEventListener('click', function() {
        const listItem = this.closest('li.message');
        const isbn = listItem.getAttribute('data-isbn');

        // Send a request to check out the book
        fetch('/books/checkout', { // Use a separate route for checking out
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'isbn': isbn
            })
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            // Update the availability status in the DOM
            const statusElement = listItem.querySelector('p[data-status]');
            if (data.available) {
                statusElement.textContent = 'Available';
            } else {
                statusElement.textContent = 'Not Available';
            }
        });
    });
});


Array.from(trash).forEach(function(element) {
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

