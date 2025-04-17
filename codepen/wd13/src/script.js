// JavaScript
const text = document.querySelector('.text');
const light = document.querySelector('#light');

document.addEventListener('mousemove', (e) => {
  // Get the position relative to the text element
  const rect = text.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Update light position
  light.setAttribute('x', x);
  light.setAttribute('y', y);

});

// Prevent new lines on enter
text.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
});