const quoteEl = document.getElementById('quote');
const authorEl = document.getElementById('author');
const entryInput = document.getElementById('entry');
const saveBtn = document.getElementById('save-btn');
const entriesList = document.getElementById('entries-list');
const API_URL = 'https://daily-quote-vnwg.onrender.com';

// Load quote on page load
fetch(`${API_URL}/quote`)
  .then(res => res.json())
  .then(data => {
    quoteEl.textContent = `"${data.quote}"`;
    authorEl.textContent = `— ${data.author}`;
  })
  .catch(err => console.error('Failed to load quote:', err));

// Load existing entries
function loadEntries() {
  fetch(`${API_URL}/entries`)
    .then(res => res.json())
    .then(entries => {
      if (!Array.isArray(entries)) {
        console.error('Expected an array of entries:', entries);
        return;
      }

      entriesList.innerHTML = '';
      entries.reverse().forEach(entry => {
        const li = document.createElement('li');

        const entryText = document.createElement('span');
        entryText.textContent = `[${new Date(entry.date).toLocaleString()}] ${entry.text}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.style.backgroundColor = '#e74c3c';
        deleteBtn.style.color = 'white';
        deleteBtn.style.border = 'none';
        deleteBtn.style.borderRadius = '5px';
        deleteBtn.style.padding = '4px 8px';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.onclick = () => deleteEntry(entry.id);

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.style.marginLeft = '10px';
        editBtn.style.backgroundColor = '#3498db';
        editBtn.style.color = 'white';
        editBtn.style.border = 'none';
        editBtn.style.borderRadius = '5px';
        editBtn.style.padding = '4px 8px';
        editBtn.style.cursor = 'pointer';
        editBtn.onclick = () => {
          const updatedText = prompt('Edit your entry:', entry.text);
          if (updatedText && updatedText.trim() !== '') {
            fetch(`${API_URL}/entry/${entry.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: updatedText })
            })
              .then(res => res.json())
              .then(data => {
                if (data.message === 'Entry updated!') {
                  loadEntries();
                } else {
                  alert('Failed to update entry!');
                }
              })
              .catch(err => {
                console.error('Error updating entry:', err);
                alert('Failed to update entry!');
              });
          }
        };

        li.appendChild(entryText);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        entriesList.appendChild(li);
      });
    })
    .catch(err => console.error('Failed to load entries:', err));
}

loadEntries();

// Save new entry
saveBtn.addEventListener('click', () => {
  const text = entryInput.value.trim();
  if (!text) return alert('Please write something!');

  fetch(`${API_URL}/entry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'Entry saved!') {
        entryInput.value = '';
        loadEntries();
      } else {
        alert('Failed to save entry!');
      }
    })
    .catch(err => {
      console.error('Error saving entry:', err);
      alert('Failed to save entry!');
    });
});

// Delete entry
function deleteEntry(id) {
  if (!confirm('Are you sure you want to delete this entry?')) return;

  fetch(`${API_URL}/entry/${id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'Entry deleted') {
        loadEntries();
      } else {
        alert('Failed to delete entry!');
      }
    })
    .catch(err => {
      console.error('Error deleting entry:', err);
      alert('Failed to delete entry!');
    });
}
