export interface Slide {
  title: string;
  content: string[];
  code?: string;
  terminal?: string;
  reference?: string;
  note?: string;
  solutionUrl?: string;
  table?: {
    headers: string[];
    rows: string[][];
  };
  cards?: {
    title: string;
    description: string;
    icon: string;
    link?: string;
  }[];
}

export const slidesData: Record<number, Slide[]> = {
  1: [
    {
      title: "¿Qué es LibGDX?",
      content: [
        "LibGDX es un framework de desarrollo de juegos multiplataforma basado en Java.",
        "Permite escribir el código una sola vez y desplegarlo en Windows, macOS, Linux, Android, iOS y Web (HTML5)."
      ]
    },
    {
      title: "Framework vs Motor",
      content: [
        "A diferencia de motores como Unity o Unreal, LibGDX es un framework centrado en código.",
        "Esto te da control total sobre la arquitectura de tu juego, ideal para entender cómo funciona un juego desde cero sin depender de interfaces visuales complejas."
      ]
    },
    {
      title: "Características Principales",
      content: [
        "• Multiplataforma: Escribe una vez, ejecuta en cualquier lugar.",
        "• Open Source: Código abierto bajo licencia Apache 2.0.",
        "• Rendimiento: Basado en OpenGL (JNI) para un alto rendimiento gráfico.",
        "• Ecosistema: Gran cantidad de extensiones (Box2D, Ashley, FreeType)."
      ]
    }
  ],
  2: [
    {
      title: "Estructura del Proyecto",
      content: [
        "Un proyecto de LibGDX se divide en varios módulos (proyectos de Gradle):",
        "• Core: Contiene la lógica principal del juego. Aquí escribiremos el 99% del código de nuestro clon de Pokémon.",
        "• Lwjgl3 (Desktop): El lanzador para PC (Windows, Mac, Linux)."
      ]
    },
    {
      title: "El Lanzador de Escritorio (lwjgl3)",
      content: [
        "El módulo lwjgl3 contiene la clase Lwjgl3Launcher, que es el punto de entrada para PC.",
        "Aquí se configura la ventana y se inicia la aplicación."
      ],
      code: `package io.github.alfosua.pokemongdx.lwjgl3;\n\nimport com.badlogic.gdx.backends.lwjgl3.Lwjgl3Application;\nimport com.badlogic.gdx.backends.lwjgl3.Lwjgl3ApplicationConfiguration;\nimport io.github.alfosua.pokemongdx.Main;\n\npublic class Lwjgl3Launcher {\n    public static void main(String[] args) {\n        Lwjgl3ApplicationConfiguration config = new Lwjgl3ApplicationConfiguration();\n        config.setTitle("PokemonGDX");\n        config.setWindowedMode(800, 600);\n        new Lwjgl3Application(new Main(), config);\n    }\n}`
    },
    {
      title: "El Ciclo de Vida",
      content: [
        "Todo juego en LibGDX implementa la interfaz ApplicationListener.",
        "Esta interfaz define los métodos que el sistema operativo llamará en diferentes momentos de la vida de la aplicación."
      ]
    },
    {
      title: "ApplicationAdapter",
      content: [
        "Usaremos ApplicationAdapter, una clase que implementa ApplicationListener con métodos vacíos, para solo sobrescribir los que necesitemos."
      ],
      code: `package io.github.alfosua.pokemongdx;\n\nimport com.badlogic.gdx.ApplicationAdapter;\n\npublic class Main extends ApplicationAdapter {\n    @Override\n    public void create() {\n        // Inicialización\n    }\n}`
    },
    {
      title: "El Bucle Principal",
      content: [
        "El método render() se llama continuamente (usualmente 60 veces por segundo).",
        "Aquí es donde actualizamos la lógica del juego y dibujamos los gráficos."
      ],
      code: `    @Override\n    public void render() {\n        // Bucle principal del juego (60 FPS)\n    }\n\n    @Override\n    public void dispose() {\n        // Liberar memoria al cerrar\n    }\n}`
    }
  ],
  3: [
    {
      title: "Dibujando al Entrenador",
      content: [
        "Para dibujar a nuestro protagonista, necesitamos definir algunas propiedades básicas en nuestra clase Main.",
        "Usaremos SpriteBatch para dibujar y Texture para la imagen estática."
      ]
    },
    {
      title: "Propiedades Básicas",
      content: [
        "Definimos el tamaño de los tiles, el batch, la textura del entrenador y su posición inicial (x, y)."
      ],
      code: `public class Main extends ApplicationAdapter {\n    private final int TILE_SIZE = 16;\n\n    private SpriteBatch batch;\n    private Texture entrenador;\n    \n    private float x = 100f;\n    private float y = 100f;\n    // ...\n}`
    },
    {
      title: "Inicializando Recursos",
      content: [
        "En el método create(), instanciamos el SpriteBatch y cargamos la textura del entrenador."
      ],
      code: `    @Override\n    public void create() {\n        batch = new SpriteBatch();\n        entrenador = new Texture("entrenador.png");\n    }`
    },
    {
      title: "Renderizando la Imagen",
      content: [
        "En el método render(), limpiamos la pantalla y dibujamos la textura en la posición (x, y)."
      ],
      code: `    @Override\n    public void render() {\n        ScreenUtils.clear(0f, 0f, 0f, 1);\n        \n        batch.begin();\n        batch.draw(entrenador, x, y);\n        batch.end();\n    }`
    }
  ],
  4: [
    {
      title: "Animando el Caminado",
      content: [
        "Para animar al personaje, necesitamos una hoja de sprites (SpriteSheet) y una clase Animation."
      ]
    },
    {
      title: "Propiedades de Animación",
      content: [
        "Añadimos variables para la hoja de texturas, la animación y el tiempo transcurrido (stateTime)."
      ],
      code: `    // Nuevas propiedades en Main:\n    private Texture entrenador_sheet;\n    private Animation<TextureRegion> animCaminarAbajo;\n    private float stateTime = 0f;`
    },
    {
      title: "Cargando y Dividiendo",
      content: [
        "Cargamos la hoja 'entrenador_caminando.png' y la dividimos en cuadros de 16x24 píxeles."
      ],
      code: `    // En create():\n    entrenador_sheet = new Texture("entrenador_caminando.png");\n    // Dividimos la hoja en cuadros de 16x24 píxeles\n    TextureRegion[][] tmp = TextureRegion.split(entrenador_sheet, 16, 24);`
    },
    {
      title: "Creando la Animación",
      content: [
        "Seleccionamos los cuadros para la animación de caminar hacia abajo y creamos el objeto Animation."
      ],
      code: `    TextureRegion[] framesAbajo = {\n        tmp[0][0], tmp[0][1], tmp[0][2], tmp[0][1],\n    };\n\n    animCaminarAbajo = new Animation<>(0.15f, framesAbajo);`
    },
    {
      title: "Dibujando el Frame Actual",
      content: [
        "En render(), actualizamos el stateTime y obtenemos el frame correspondiente para dibujar."
      ],
      code: `    // En render(), dentro de batch.begin() y batch.end():\n    stateTime += Gdx.graphics.getDeltaTime();\n    TextureRegion frameActual = animCaminarAbajo.getKeyFrame(stateTime, true);\n    batch.draw(frameActual, x, y);`
    }
  ],
  5: [
    {
      title: "Movimiento en Cuadrícula",
      content: [
        "El movimiento en Pokémon es tile por tile. Necesitamos variables para controlar este desplazamiento."
      ]
    },
    {
      title: "Propiedades de Movimiento",
      content: [
        "Añadimos variables para la velocidad, el destino y una bandera para saber si nos estamos moviendo."
      ],
      code: `    // Nuevas propiedades en Main:\n    private float velocidad = 50f;\n    private float destinoX = x;\n    private float destinoY = y;\n    private boolean moviendose = false;`
    },
    {
      title: "Detectando Input",
      content: [
        "Si no nos estamos moviendo, calculamos la próxima posición potencial (proximoX, proximoY)."
      ],
      code: `    if (!moviendose) {\n        float proximoX = x;\n        float proximoY = y;\n\n        if (Gdx.input.isKeyPressed(Input.Keys.UP)) {\n            proximoY = y + TILE_SIZE;\n        } else if (Gdx.input.isKeyPressed(Input.Keys.DOWN)) {\n            proximoY = y - TILE_SIZE;\n        } else if (Gdx.input.isKeyPressed(Input.Keys.LEFT)) {\n            proximoX = x - TILE_SIZE;\n        } else if (Gdx.input.isKeyPressed(Input.Keys.RIGHT)) {\n            proximoX = x + TILE_SIZE;\n        }\n        // ... (verificación de colisiones más adelante)\n    }`
    },
    {
      title: "Actualizando el Destino",
      content: [
        "Si hemos detectado un intento de movimiento, actualizamos el destino y activamos la bandera."
      ],
      code: `        if (proximoX != x || proximoY != y) {\n            // Por ahora, nos movemos siempre (sin colisiones)\n            destinoX = proximoX;\n            destinoY = proximoY;\n            moviendose = true;\n        }`
    },
    {
      title: "Lógica de Movimiento",
      content: [
        "Si nos estamos moviendo, avanzamos hacia el destino en el eje correspondiente."
      ],
      code: `    if (moviendose) {\n        float dt = Gdx.graphics.getDeltaTime();\n        float paso = velocidad * dt;\n\n        if (y < destinoY) y = Math.min(y + paso, destinoY);\n        else if (y > destinoY) y = Math.max(y - paso, destinoY);\n\n        if (x < destinoX) x = Math.min(x + paso, destinoX);\n        else if (x > destinoX) x = Math.max(x - paso, destinoX);\n\n        if (x == destinoX && y == destinoY) moviendose = false;\n    }`
    }
  ],
  6: [
    {
      title: "La Cámara del Jugador",
      content: [
        "El mundo es más grande que la pantalla. La OrthographicCamera define qué parte del mundo es visible y sigue al jugador."
      ]
    },
    {
      title: "Propiedades de Cámara",
      content: [
        "Necesitamos una cámara y un Viewport para manejar la vista."
      ],
      code: `    // Nuevas propiedades en Main:\n    private OrthographicCamera camara;\n    private Viewport viewport;`
    },
    {
      title: "Configurando la Cámara",
      content: [
        "Creamos la cámara y un FitViewport que se adapta al tamaño de la ventana."
      ],
      code: `    // En create():\n    camara = new OrthographicCamera();\n    viewport = new FitViewport(Gdx.graphics.getWidth(), Gdx.graphics.getHeight(), camara);`
    },
    {
      title: "Actualizando el Viewport",
      content: [
        "Cuando la ventana cambia de tamaño, debemos actualizar el Viewport."
      ],
      code: `    @Override\n    public void resize(int width, int height) {\n        viewport.update(width, height);\n    }`
    },
    {
      title: "Siguiendo al Jugador",
      content: [
        "En el método render(), actualizamos la posición de la cámara para que coincida con la del jugador."
      ],
      code: `    // En render():\n    camara.position.set(x, y, 0);\n    camara.update();\n\n    batch.setProjectionMatrix(camara.combined);`
    }
  ],
  7: [
    {
      title: "Creando el Mapa",
      content: [
        "Tiled es un editor de mapas gratuito muy popular para juegos 2D.",
        "Nos permite crear la región (Pueblo Paleta, Rutas) usando 'Tilesets' (hojas de texturas con hierba, agua, casas)."
      ],
      cards: [
        {
          title: "Tiled Map Editor",
          description: "Descarga la herramienta oficial para crear tus mapas ortogonales.",
          icon: "Monitor",
          link: "https://www.mapeditor.org/"
        }
      ]
    },
    {
      title: "Capas en Tiled",
      content: [
        "En Tiled, organizamos el mapa en capas:",
        "• Fondo: Hierba, caminos (siempre debajo del jugador).",
        "• Objetos: Casas, árboles (pueden estar encima o debajo del jugador).",
        "• Colisiones: Capa invisible para marcar zonas bloqueadas."
      ]
    }
  ],
  8: [
    {
      title: "Renderizando el Entorno",
      content: [
        "LibGDX incluye soporte nativo para cargar y renderizar mapas de Tiled (.tmx)."
      ]
    },
    {
      title: "Propiedades del Mapa",
      content: [
        "Necesitamos un renderizador para el mapa y una referencia a la capa de colisiones."
      ],
      code: `    // Nuevas propiedades en Main:\n    OrthogonalTiledMapRenderer mapRenderer;\n    TiledMapTileLayer capaColisiones;`
    },
    {
      title: "Cargando el Mapa",
      content: [
        "Usamos TmxMapLoader para cargar el archivo del mapa y creamos un OrthogonalTiledMapRenderer para dibujarlo."
      ],
      code: `    // En create():\n    TiledMap mapa = new TmxMapLoader().load("mapa.tmx");\n    mapRenderer = new OrthogonalTiledMapRenderer(mapa);`
    },
    {
      title: "Dibujando el Mapa",
      content: [
        "En el método render(), le pasamos la cámara al renderizador del mapa y lo dibujamos antes que al jugador."
      ],
      code: `    // En render():\n    mapRenderer.setView(camara);\n    mapRenderer.render();\n\n    batch.begin();\n    // ... dibujar jugador ...\n    batch.end();`
    }
  ],
  9: [
    {
      title: "Colisiones con Obstáculos",
      content: [
        "Para evitar que el jugador camine sobre el agua o atraviese paredes, leemos las propiedades del mapa en Tiled."
      ]
    },
    {
      title: "Obteniendo la Capa de Colisiones",
      content: [
        "Recuperamos la capa específica que creamos en Tiled para marcar las zonas bloqueadas."
      ],
      code: `    // En create():\n    capaColisiones = (TiledMapTileLayer) mapa.getLayers().get("Colisiones");`
    },
    {
      title: "Verificando la Casilla",
      content: [
        "Antes de mover al jugador, comprobamos si la casilla destino tiene un tile en la capa de colisiones."
      ],
      code: `    boolean esCasillaBloqueada(float x, float y) {\n        int tileX = (int)(x / TILE_SIZE);\n        int tileY = (int)(y / TILE_SIZE);\n\n        TiledMapTileLayer.Cell celda = capaColisiones.getCell(tileX, tileY);\n        return celda != null; // Si hay un tile, está bloqueado\n    }`
    },
    {
      title: "Integrando Colisiones",
      content: [
        "Ahora actualizamos nuestra lógica de movimiento para usar este método."
      ],
      code: `    // En render(), dentro del if (!moviendose):\n    if (proximoX != x || proximoY != y) {\n        if (!esCasillaBloqueada(proximoX, proximoY)) {\n            destinoX = proximoX;\n            destinoY = proximoY;\n            moviendose = true;\n        }\n    }`
    },
  ],
  10: [
    {
      title: "Múltiples Pantallas",
      content: [
        "Un juego real tiene múltiples pantallas: Pantalla de Título, Mundo, Combate, Menú de Equipo.",
        "LibGDX provee la clase Game y la interfaz Screen para facilitar la transición entre ellas."
      ]
    },
    {
      title: "Migrando a Game",
      content: [
        "Nuestra clase principal ahora heredará de Game en lugar de ApplicationAdapter.",
        "Esto nos permite usar el método setScreen() para cambiar la vista activa."
      ],
      code: `public class Main extends Game {\n    private AssetManager assets;\n\n    @Override\n    public void create() {\n        assets = new AssetManager();\n        // ... (carga de assets)\n        assets.finishLoading();\n\n        setScreen(new TitleScreen(this));\n    }\n\n    public AssetManager getAssets() {\n        return assets;\n    }\n}`
    },
    {
      title: "La Interfaz Screen",
      content: [
        "Cada pantalla implementará la interfaz Screen, que tiene sus propios métodos de ciclo de vida.",
        "Movemos toda la lógica de nuestro juego (mapa, jugador, cámara) a una nueva clase GameScreen."
      ],
      code: `public class GameScreen extends ScreenAdapter {\n    private Main game;\n    private SpriteBatch batch;\n    private Texture entrenador;\n    // ... resto de variables ...\n\n    public GameScreen(Main game) {\n        this.game = game;\n        AssetManager assets = game.getAssets();\n        // ... inicialización ...\n    }\n\n    @Override\n    public void render(float delta) {\n        // ... lógica del juego ...\n    }\n}`
    },
    {
      title: "Pantalla de Título Mínima",
      content: [
        "Creamos una pantalla de título básica que simplemente limpia la pantalla con un color diferente.",
        "Más adelante le añadiremos una interfaz gráfica."
      ],
      code: `public class TitleScreen implements Screen {\n    Main game;\n    \n    public TitleScreen(Main game) {\n        this.game = game;\n    }\n    \n    @Override\n    public void render(float delta) {\n        ScreenUtils.clear(0.2f, 0.2f, 0.5f, 1); // Fondo azulado\n    }\n    // ... (implementar métodos vacíos requeridos)\n}`
    }
  ],
  11: [
    {
      title: "Gestión de Recursos",
      content: [
        "Cargar texturas y sonidos directamente con 'new Texture()' puede bloquear el juego y causar tirones (lag).",
        "AssetManager carga recursos de forma asíncrona y gestiona sus referencias."
      ]
    },
    {
      title: "Encolando Recursos",
      content: [
        "Le decimos al AssetManager qué archivos necesitamos cargar y de qué tipo son."
      ],
      code: `// En Main.create():\nassets = new AssetManager();\nassets.setLoader(TiledMap.class, new TmxMapLoader(new InternalFileHandleResolver()));\n\nassets.load("entrenador.png", Texture.class);\nassets.load("entrenador_caminando.png", Texture.class);\nassets.load("mapa.tmx", TiledMap.class);\nassets.load("skin/uiskin.json", Skin.class);`
    },
    {
      title: "Cargando y Obteniendo",
      content: [
        "Una vez cargados (con finishLoading() o update()), obtenemos los recursos en nuestras pantallas."
      ],
      code: `// En GameScreen constructor:\nAssetManager assets = game.getAssets();\n\nentrenador = assets.get("entrenador.png", Texture.class);\nentrenador_sheet = assets.get("entrenador_caminando.png", Texture.class);\nmapa = assets.get("mapa.tmx", TiledMap.class);`
    }
  ],
  12: [
    {
      title: "Interfaz con Scene2D",
      content: [
        "Scene2D es un grafo de escena 2D para construir interfaces de usuario (UI) y manejar eventos.",
        "Lo usaremos en nuestra TitleScreen para crear un botón de 'Jugar' que nos lleve al juego."
      ]
    },
    {
      title: "Configurando el Stage",
      content: [
        "Creamos el Stage y le decimos a LibGDX que envíe los eventos de entrada (clics) a él."
      ],
      code: `public TitleScreen(Main game) {\n    this.game = game;\n\n    Skin skin = game.getAssets().get("skin/uiskin.json", Skin.class);\n\n    stage = new Stage(new ScreenViewport());\n    Gdx.input.setInputProcessor(stage);\n    // ...\n}`
    },
    {
      title: "Añadiendo el Botón de Jugar",
      content: [
        "Creamos un botón, le asignamos un listener para detectar clics y transicionar a GameScreen."
      ],
      code: `TextButton botonJugar = new TextButton("Jugar", skin);\nbotonJugar.setPosition(Gdx.graphics.getWidth()/2f, Gdx.graphics.getHeight()/2f, Align.center);\n\nbotonJugar.addListener(new ClickListener() {\n    @Override\n    public void clicked(InputEvent event, float x, float y) {\n        game.setScreen(new GameScreen(game));\n    }\n});\n\nstage.addActor(botonJugar);`
    },
    {
      title: "Renderizando la UI",
      content: [
        "En el método render de la pantalla de título, actualizamos y dibujamos el stage."
      ],
      code: `    @Override\n    public void render(float delta) {\n        ScreenUtils.clear(0.2f, 0.2f, 0.5f, 1); // Fondo azulado\n        stage.act(delta);\n        stage.draw();\n    }`
    }
  ],
  13: [
    {
      title: "Transición al Combate",
      content: [
        "Cuando el jugador camina por la hierba alta, hay una probabilidad de encontrar un Pokémon salvaje."
      ]
    },
    {
      title: "Probabilidad de Encuentro",
      content: [
        "Al pisar una casilla de hierba, generamos un número aleatorio para decidir si hay combate."
      ],
      code: `void pisarHierba() {\n    // 15% de probabilidad de encuentro\n    if (MathUtils.random() < 0.15f) {\n        iniciarCombateSalvaje();\n    }\n}`
    },
    {
      title: "Iniciando la Transición",
      content: [
        "Pausamos el movimiento, cambiamos la música y comenzamos un efecto visual antes de cambiar de pantalla."
      ],
      code: `void iniciarCombateSalvaje() {\n    jugador.detenerMovimiento();\n    reproducirMusicaEncuentro();\n    iniciarAnimacionTransicion();\n    \n    // Al terminar la animación:\n    // game.setScreen(new BattleScreen());\n}`
    }
  ],
  14: [
    {
      title: "Pantalla de Combate",
      content: [
        "La pantalla de combate (BattleScreen) es una escena completamente separada del mundo.",
        "Dibuja los sprites de los monstruos, barras de vida y un menú de acciones usando Scene2D."
      ]
    },
    {
      title: "Estructura de BattleScreen",
      content: [
        "Implementamos la interfaz Screen y preparamos los elementos necesarios."
      ],
      code: `public class BattleScreen implements Screen {\n    Texture fondoBatalla;\n    Texture spriteEnemigo;\n    Texture spriteJugador;\n    Stage uiStage;\n    // ...\n}`
    },
    {
      title: "Renderizando el Combate",
      content: [
        "Dibujamos el fondo, los sprites y finalmente la interfaz de usuario."
      ],
      code: `    @Override\n    public void render(float delta) {\n        // Dibujar fondo y sprites con SpriteBatch\n        \n        // Actualizar y dibujar UI (menú, barras de HP)\n        uiStage.act(delta);\n        uiStage.draw();\n    }`
    }
  ],
  15: [
    {
      title: "Música y Efectos",
      content: [
        "LibGDX distingue entre efectos de sonido cortos (Sound) y música de fondo larga (Music)."
      ]
    },
    {
      title: "Sound vs Music",
      content: [
        "Los Sound se cargan completamente en RAM (ej. gritos de Pokémon, ataques).",
        "Music se transmite desde el disco (ej. música de batalla), ahorrando memoria."
      ],
      code: `Sound placaje = Gdx.audio.newSound(Gdx.files.internal("tackle.wav"));\nMusic musicaBatalla = Gdx.audio.newMusic(Gdx.files.internal("battle_theme.mp3"));`
    },
    {
      title: "Reproduciendo Audio",
      content: [
        "Podemos ajustar el volumen, hacer que la música se repita (loop) y reproducir los sonidos."
      ],
      code: `// Reproducir efecto de ataque al 100% de volumen\nplacaje.play(1.0f); \n\n// Iniciar música de fondo en bucle\nmusicaBatalla.setLooping(true);\nmusicaBatalla.play();`
    }
  ],
  16: [
    {
      title: "Pulido y Exportación",
      content: [
        "¡Tu clon de Pokémon está listo!",
        "El último paso es usar Gradle para compilar el juego en un archivo ejecutable y compartirlo con el mundo."
      ]
    },
    {
      title: "Exportando para PC",
      content: [
        "Para crear un archivo .jar ejecutable que funcione en Windows, Mac y Linux, usamos la tarea desktop:dist de Gradle."
      ],
      terminal: `$ ./gradlew desktop:dist`
    },
    {
      title: "Exportando para Android",
      content: [
        "Para crear un archivo .apk que puedas instalar en tu teléfono Android, usamos android:assembleRelease."
      ],
      terminal: `$ ./gradlew android:assembleRelease`
    }
  ]
};
