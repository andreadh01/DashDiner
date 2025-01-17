#Environment
Se está utilizando un entorno virtual para organizar las dependencias del proyecto. Es importante instalar _pipenv_ en tu computadora con el siguiente comando:

```
pip install pipenv
```

Para activar el environment:

```
cd backend
source $(pipenv --venv)/bin/activate
```

Al instalar una nueva dependencia, correr el siguiente comando para que se instale la dependencia y se actualice el Pipfile:

```
cd backend
pipenv install //dependencia
```

Al hacer un pull, actualiza las dependencias:

```
cd backend
pipenv install
```

#Backend
Correr el backend:

```
cd backend
python app.py
```

#Frontend
Correr el frontend:

```
cd frontend
ng serve
```
