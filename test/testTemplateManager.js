var tm     = require('../lib/templateManager')
  , expect = require('chai').expect;

describe('Template manager', function() {

  it('should render ejs', function(done) {
    var opts = {
      locals: {item: 'test'},
      filename: 'test.ejs',
      source: '<h1><%= item%> <%= engine%></h1>'
    }

    tm.render(opts, function(err, res) {
      expect(err).to.be.null;
      expect(res).to.equal('<h1>test .ejs</h1>');

      done()
    })
  })

  it('should render jade', function(done) {
    var opts = {
      locals: {item: 'test'},
      filename: 'test.jade',
      source: 'h1= item\nh1= engine'
    }

    tm.render(opts, function(err, res) {
      expect(err).to.be.null;
      expect(res).to.equal('<h1>test</h1><h1>.jade</h1>');

      done()
    })
  })

  it('should render swig', function(done) {
    var opts = {
      locals: {item: 'test'},
      filename: 'test.swig',
      source: '<h1>{{ item }} {{ engine }}</h1>'
    }

    tm.render(opts, function(err, res) {
      expect(err).to.be.null;
      expect(res).to.equal('<h1>test .swig</h1>');

      done()
    })
  })

  it('should render handlebars', function(done) {
    var opts = {
      locals: {item: 'test'},
      filename: 'test.handlebars',
      source: '<h1>{{ item }} {{ engine }}</h1>'
    }

    tm.render(opts, function(err, res) {
      expect(err).to.be.null;
      expect(res).to.equal('<h1>test .handlebars</h1>');

      done()
    })
  })

  it('should render less', function(done) {
    var opts = {
      locals   : {},
      filename : 'test.less',
      source   : '.class{ width: (1 + 1) }'
    }

    tm.render(opts, function(err, res) {
      expect(err).to.be.null;
      expect(res).to.equal('.class {\n  width: 2;\n}\n');

      done()
    })
  })

  it('should render stylus', function(done) {
    var opts = {locals: {}};
    opts.filename = 'test.stylus';
    opts.source = 'body\n  width: 2px\n';
    tm.render(opts, function(err, res) {
      expect(err).to.be.null;
      expect(res).to.equal('body {\n  width: 2px;\n}\n');
      done();
    })
  })

  it('should render styl', function(done) {
    var opts = {
      locals   : {whitespace: true},
      filename : 'test.styl',
      source   : 'body\n  color: blue'
    }

    tm.render(opts, function(err, res) {
      expect(err).to.be.null;
      expect(res).to.equal('body {\n  color: blue;\n}')
      done()
    })
  })

  it('should render sass', function(done) {
    var opts = {
      locals   : {},
      filename : 'test.sass',
      source   : '$gray: #ccc;body {color: $gray}'
    }

    tm.render(opts, function(err, res) {
      expect(err).to.be.null;
      expect(res).to.equal('body {\n  color: #ccc; }\n');

      done()
    })
  })

  it('should render css', function(done) {
    var opts = {
      locals   : {},
      filename : 'test.css',
      source   : 'body { color: #ccc; }'
    }

    tm.render(opts, function(err, res) {
      expect(err).to.be.null;
      expect(res).to.equal('body { color: #ccc; }');

      done()
    })
  })
})