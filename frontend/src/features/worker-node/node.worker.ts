const context: Worker = self as any;

console.log('Worker started');

context.addEventListener('message', (e) => {
  console.log('Received a message in the worker', e);
});
