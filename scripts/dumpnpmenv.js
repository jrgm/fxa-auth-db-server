console.log('b')

Object.keys(process.env).sort().filter(function(key) {
  return key.indexOf('npm') === 0;
}).forEach(function(key) {
  console.log(key, '\t', process.env[key])
})
