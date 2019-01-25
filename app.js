var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var db = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./db.db"
    }
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.get('/api/alumnos/:dni', function (req, res){
    var dni = req.params.dni;
    console.log(dni);
    db.select().from("alumnos").where("dni", dni)
        .then(function (data) {
        res.json(data);
    }).catch(function (error) {
        console.log(error);
    });
});

//filtro por nombre (en caso de que contenga el parametro)
app.get('/api/alumnos/filter/:f', function (req, res){
    var f = req.params.f;
    console.log(f);
    db.select().from("alumnos")
        .where("nombre", "like", "%"+f+"%")
        .then(function (data) {
            res.json(data);
        }).catch(function (error) {
        console.log(error);
    });
});

app.get('/api/alumnoscentro/:id_c', function (req, res) {
    var id_c = req.params.id_c;
    console.log(id_c);
    db.select().from("alumnos").where("id_centro",id_c)
        .then(function (data) {
            res.json(data);
        }).catch(function (error) {
        console.log(error);
    });
});

//obtener los tutores del alumno del cual hemos pasado el dni
app.get('/api/alumno_tutor/:dni_a/', function (req, res) {
    var dni_a = req.params.dni_a;
    console.log(dni_a);
    db.select("tutor.dni", "tutor.nombre")
        .from("alumnos_has_tutor")
        .where("dni_alumno",dni_a)
        .join("tutor","dni_tutor", "tutor.dni")
        .then(function (data) {
            res.json(data);
        }).catch(function (error) {
        console.log(error);
    });
});

app.get('/api/alumnos', function (req, res){
    db.select().from("alumnos").then(function (data) {
    res.json(data);
    }).catch(function (error) {
        console.log(error);
    });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
