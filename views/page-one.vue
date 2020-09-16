<template>
    <div id="app">
        <div v-if="seenLogs">
        <div>
            <nav class="navbar navbar-dark bg-dark">
                <a href="/api/v1/" class="navbar-left">
                    <img src="/public/images/Logo-Kimo.jpg" id="logoKimo">
                </a>
                <a class="navbar-brand" id="SearchText">Recherche de log par :</a>
                <ul class="ulBtnLogs">
                    <div class="btn-group">
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            DevEUi
                        </button>
                        <div class="dropdown-menu">
                            <div class="form-group">
                                <label for="devUi">devEUi</label>
                                <input type="text" class="form-control" id="devUi" name="devUi" required pattern="[a-fA-F\d]+">
                            </div>
                            <div class="form-group">
                                <label for="timeStart">Date début</label>
                                <input type="datetime-local" class="form-control" id="timeStart" name="timeStart" required>
                            </div>
                            <div class="form-group">
                                <label for="timeEnd">Date fin</label>
                                <input type="datetime-local" class="form-control" id="timeEnd" name="timeEnd" required>
                            </div>
                            <div class="form-group">
                                <label for="limit">nombre de log</label>
                                <input type="text" class="form-control" id="limit" name="limit" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Rechercher</button>
                        </div>
                    </div>
                    <div class="btn-group">
                        <button type="button" class="btn btn-secondary dropdown-toggle  " data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Type
                        </button>
                        <div class="dropdown-menu">
                            <div class="form-group">
                                <label for="devUi">Type</label>
                                <input type="text" class="form-control" id="type" name="type" required>
                            </div>
                            <div class="form-group">
                                <label for="timeStart">Date début</label>
                                <input type="datetime-local" class="form-control" id="timeStart" name="timeStart" required>
                            </div>
                            <div class="form-group">
                                <label for="timeEnd">Date fin</label>
                                <input type="datetime-local" class="form-control" id="timeEnd" name="timeEnd" required>
                            </div>
                            <div class="form-group">
                                <label for="limit">nombre de log</label>
                                <input type="text" class="form-control" id="limit" name="limit" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Rechercher</button>
                        </div>
                    </div>
                    <div class="btn-group">
                        <button type="button" class="btn btn-secondary dropdown-toggle  " data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Date
                        </button>
                        <div class="dropdown-menu">
                            <div class="form-group">
                                <label for="timeStart">Date début</label>
                                <input type="datetime-local" class="form-control" id="timeStart" name="timeStart" required>
                            </div>
                            <div class="form-group">
                                <label for="limit">Date Fin</label>
                                <input type="datetime-local" class="form-control" id="timeEnd" name="timeEnd" required>
                            </div>
                            <div class="form-group">
                                <label for="limit">nombre de log</label>
                                <input type="text" class="form-control" id="limit" name="limit" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Rechercher</button>
                        </div>
                    </div>
                </ul>
                <a id="SearchText2">Nombre de logs affiché : {{count}}</a>
            </nav>

            <div class="table-responsive">
                <table class="table">
                    <thead class="thead-dark bg-dark">
                        <tr>
                            <th scope="col">DevEUI</th>
                            <th scope="col">Heure de réception</th>
                            <th scope="col">Heure émission</th>
                            <th scope="col">Payload</th>
                            <th scope="col">Action / Rx</th>
                            <th scope="col">Type</th>
                            <th scope="col">Sélectionné</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <h5 class="title">
                                    <a href='/api/v1/logs?devUi={{meta.slave}}'>{{meta.slave}} </a>
                                </h5>
                            </td>
                            <td>
                                <p class="text" id="timestampText"></p>
                            </td>
                            <td>
                                <p class="text" id="timestampText"> </p>
                            </td>
                            <td>
                                <p class="text">
                                    <div class="table-responsive ">
                                        <table class="table table-bordered" id='voiesTable'>
                                            <tbody>
                                                <td>

                                                </td>
                                            </tbody>
                                        </table>
                                    </div>

                            </td>
                            <td>
                                <p class="text">{{meta.action}} / {{meta.rx}}</p>
                            </td>
                            <td>
                                <a class="text">{{meta.type}}</a>

                            </td>
                            <td>
                                <div class="checkbox">
                                    <label>
                                        <input type="checkbox" value="{{__id}}">
                                    </label>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div v-if="seenLogin">
        <div class="container">
            <h1 class="h3 mb-3 font-weight-normal">Connectez-vous</h1>
            <label for="identifiant" class="sr-only">Identifiant</label>
            <input type="text" id="identifiant" name="identifiant" class="form-control" placeholder="Identifiant" required autofocus>
            <br>
            <label for="password" class="sr-only">Mot de passe</label>
            <input type="password" id="password" name="password" class="form-control" placeholder="Mot de passe" required>
            <br>
            <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            <p class="mt-5 mb-3 text-muted">&copy; KIMO 2017-2018</p>
        </div>
    </div>
</div>
</template>

    