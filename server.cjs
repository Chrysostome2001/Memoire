const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); 
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importer le package CORS
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken')
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const prisma = new PrismaClient();
const app = express();
const port = 8080;
const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;
const dbHost = process.env.DB_HOST;
console.log('JWT Secret:', jwtSecret);
console.log('Database Host:', dbHost);
console.log('Application Port:', port);
// Connect to MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_Memoire'
});

// Middleware to parse JSON requests
app.use(express.json());

app.use(bodyParser.json());

// CORS middleware
app.use(cors());

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401); // Si aucun token n'est fourni

  jwt.verify(token, jwtSecret, (err, user) => {
    console.log('JWT Secret:', jwtSecret);
    if (err) return res.sendStatus(403); // Si le token est invalide
    req.user = user;
    next();
  });
};



/****************************************************Parents********************************************************/
// Route to get all parents
app.get('/api/parents/', (req, res) => {
  const sql = `
                SELECT 
                      Parent.id AS parent_id,
                      Parent.nom AS parent_nom,
                      Parent.prenom AS parent_prenom,
                      Parent.contact AS parent_contact,
                      COUNT(Eleve.id) AS nb_enfant
                    FROM Parent
                     LEFT JOIN Eleve 
                          ON Eleve.id_parent = Parent.id
                        GROUP BY 
                      Parent.id, Parent.nom`;
  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    res.json(results);
  });
});

// Route to get a parent by ID
app.get('/api/parent/:id', (req, res) => {
  const sql = `SELECT 
                      Parent.id AS parent_id,
                      Parent.nom AS parent_nom,
                      Parent.prenom AS parent_prenom,
                      Parent.username AS parent_username 
                    FROM Parent 
                       WHERE id = ?`;
  const id = req.params.id;
  db.query(sql, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    res.json(results[0]);
  });
});

//Recuperer les noms des eleves par parent 

app.get('/api/parent-enfant/:id', (req, res) => {
  const idParent = req.params.id;
  const trimestreId = req.query.trimestre_id;

  const sql = `
    SELECT 
      Eleve.nom AS nom_eleve, 
      Parent.nom AS nom_parent,
      Matiere.matiere AS matiere,
      Note_inter.inter AS note_inter,
      Note_devoir.devoir AS note_devoir,
      Coefficient.coefficient AS coef,
      Trimestre.id AS trimestre_id
    FROM 
      Eleve
    LEFT JOIN 
      Parent ON Parent.id = Eleve.id_parent
    CROSS JOIN
      Matiere
    LEFT JOIN (
      SELECT 
        id_eleve,
        id_matiere,
        inter
      FROM 
        Note_inter
      WHERE 
        id_trimestre = ?
    ) AS Note_inter ON Eleve.id = Note_inter.id_eleve AND Matiere.id = Note_inter.id_matiere
    LEFT JOIN (
      SELECT 
        id_eleve,
        id_matiere,
        devoir
      FROM 
        Note_devoir
      WHERE 
        id_trimestre = ?
    ) AS Note_devoir ON Eleve.id = Note_devoir.id_eleve AND Matiere.id = Note_devoir.id_matiere
    LEFT JOIN 
      Coefficient ON Coefficient.id = Matiere.id_coefficient
    LEFT JOIN 
      Trimestre ON Trimestre.id = ?
    WHERE 
      Parent.id = ?;
  `;

  db.query(sql, [trimestreId, trimestreId, trimestreId, idParent], (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    res.json(results);
  });
});



/*********************************************Eleves***********************************************************/
app.get('/api/eleve/:id', (req, res) => {
  const id = req.params.id; 
  const query = `
                  SELECT 
                          Eleve.id AS eleve_id,
                          Eleve.nom AS eleve_nom,
                          Eleve.prenom AS eleve_prenom,
                          Eleve.username AS eleve_username
                         FROM Eleve 
                          WHERE id = ?`;
 

  db.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results[0]); // Assuming you want to return the first result
    }
  });
});


app.get('/api/eleves/', (req, res) => {
  const sql = `
              SELECT 
                    Eleve.id AS eleve_id,
                    Eleve.nom AS eleve_nom,
                    Eleve.prenom AS eleve_prenom,
                    Eleve.id_classe AS classe_id,
                    Classe.nom AS classe_nom
                  FROM
                      Eleve
                  JOIN Classe ON Classe.id = Eleve.id_classe`
                  ;
  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Eleves not found' });
    }
    res.json(results);
  });
});

// Route to get grades for a student by ID
app.get('/api/eleve/:id/notes', (req, res) => {
  const id = req.params.id;
  const trimestreId = req.query.trimestre_id;
  const sql = `
    SELECT 
    Eleve.nom AS nom_eleve,
    Eleve.prenom AS prenom_eleve, 
    Eleve.sexe AS eleve_sexe,
    Classe.nom AS classe_nom,
    Parent.nom AS nom_parent,
    Matiere.matiere AS matiere,
    NI.inter AS note_inter,
    ND.devoir AS note_devoir,
    NI.id AS note_inter_id,
    ND.id AS note_devoir_id,
    Coefficient.coefficient AS coef,
    Rang.rang AS rang,
    Trimestre.id AS trimestre_id
FROM 
    Eleve
LEFT JOIN
    Classe ON Classe.id = Eleve.id_classe
LEFT JOIN 
    Parent ON Parent.id = Eleve.id_parent
LEFT JOIN 
    Enseignant_Classe ON Enseignant_Classe.id_classe = Classe.id
LEFT JOIN 
    Matiere ON Matiere.id = Enseignant_Classe.id_matiere
LEFT JOIN (
    SELECT 
        id,
        id_eleve,
        id_matiere,
        inter,
        id_enseignant
    FROM 
        Note_inter
    WHERE 
        id_trimestre = ?
) AS NI ON Eleve.id = NI.id_eleve AND Matiere.id = NI.id_matiere
LEFT JOIN (
    SELECT 
        id,
        id_eleve,
        id_matiere,
        devoir,
        id_enseignant
    FROM 
        Note_devoir
    WHERE 
        id_trimestre = ? 
) AS ND ON Eleve.id = ND.id_eleve AND Matiere.id = ND.id_matiere
LEFT JOIN 
    Coefficient ON Coefficient.id = Matiere.id_coefficient 
LEFT JOIN 
    Trimestre ON Trimestre.id = ?
LEFT JOIN 
    Enseignant ON Enseignant.id = NI.id_enseignant OR Enseignant.id = ND.id_enseignant
LEFT JOIN 
    Rang ON Rang.id_eleve = Eleve.id AND Rang.id_matiere = Matiere.id AND Rang.id_trimestre = Trimestre.id
   
WHERE 
    Eleve.id = ?


  `;

  db.query(sql, [trimestreId, trimestreId, trimestreId, id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Notes not found for this student' });
    }
    res.json(results);
  });
});


app.get('/api/eleves/:id', (req, res) => {
  const id = req.params.id;
  const query = `SELECT 
                    Eleve.id AS eleve_id,
                    Eleve.nom AS eleve_nom,
                    Eleve.prenom AS eleve_prenom,
                    Classe.nom AS eleve_classe
                  FROM Eleve 
                  JOIN Classe ON Eleve.id_classe = Classe.id
                  WHERE Eleve.id_parent = ?`;

  db.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results); // Return all results for children of the parent
    }
  });
});

app.get('/api/student-bulletin/:id_eleve/:id_trimestre', async (req, res) => {
  const { id_eleve, id_trimestre } = req.params;

  try {
    const bulletinData = await prisma.$queryRaw`
      SELECT 
    m.id AS matiere_id,
    m.matiere AS matiere_name,
    c.coefficient AS coefficient,
    TRUNCATE((si.moy_interro + COALESCE(sd.total_devoir, 0)) / 3, 2) AS moyenne,
    r.rang AS rang
FROM 
    Matiere m
    JOIN Coefficient c ON m.id = c.id
    JOIN Rang r ON m.id = r.id_matiere
    LEFT JOIN (
        SELECT 
            ni.id_matiere,
            AVG(ni.inter) AS moy_interro
        FROM 
            Note_inter ni
        WHERE 
            ni.id_eleve = ${Number(id_eleve)} AND ni.id_trimestre = ${Number(id_trimestre)}
        GROUP BY 
            ni.id_matiere
    ) si ON m.id = si.id_matiere
    LEFT JOIN (
        SELECT 
            nd.id_matiere,
            SUM(nd.devoir) AS total_devoir
        FROM 
            Note_devoir nd
        WHERE 
            nd.id_eleve = ${Number(id_eleve)} AND nd.id_trimestre = ${Number(id_trimestre)}
        GROUP BY 
            nd.id_matiere
    ) sd ON m.id = sd.id_matiere
WHERE 
    r.id_eleve = ${Number(id_eleve)} AND r.id_trimestre = ${Number(id_trimestre)}
GROUP BY 
    m.id, m.matiere, c.coefficient, r.rang;
    `;

    res.json(bulletinData);
  } catch (error) {
    console.error("Erreur lors de la récupération des données du bulletin:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});



/**************************************************Enseignant*****************************************************/

// Route to get a enseignant by ID
app.get('/api/enseignant/:id', (req, res) => {
  const sql = 'SELECT * FROM Enseignant WHERE id = ?';
  const id = req.params.id;
  db.query(sql, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Enseignant not found' });
    }
    res.json(results[0]);
  });
});

app.get('/api/classes/:id', (req, res) => {
  const enseignantId = req.params.id;
  const sql = `
              SELECT 
                  Classe.nom AS classe_nom, 
                  Classe.id AS classe_id,
                  Matiere.id AS matiere_id,
                  Matiere.matiere AS matiere_nom
              FROM Classe 
              INNER JOIN Enseignant_Classe ON Classe.id = Enseignant_Classe.id_classe
              INNER JOIN Matiere ON Enseignant_Classe.id_matiere = Matiere.id
              WHERE Enseignant_Classe.id_enseignant = ?;
  `;
  
  db.query(sql, [enseignantId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Aucune classe trouvée pour cet enseignant' });
    }
    res.json(results);
  });
});

app.get('/api/classes/', (req, res) => {
  const sql = `
              SELECT 
                  Classe.nom AS classe_nom, 
                  Classe.id AS classe_id 
              FROM Classe  
  `;
  
  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Aucune classe trouvée' });
    }
    res.json(results);
  });
});

app.get('/api/trimestres/', (req, res) => {
  const sql = `
              SELECT 
                  Trimestre.nom AS trimestre_nom, 
                  Trimestre.id AS trimestre_id 
              FROM Trimestre  
  `;
  
  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Aucun trimestre trouvé' });
    }
    res.json(results);
  });
});


app.get('/api/notes', (req, res) => {
  const classeId = req.query.classe_id;
  const enseignantId = req.query.enseignant_id;
  const trimestreId = req.query.trimestre_id;
  const matiereId = req.query.matiere_id;

  const sql = `
    SELECT
      Eleve.nom AS eleve_nom,
      Eleve.prenom AS eleve_prenom,
      Eleve.id AS eleve_id,
      Coefficient.coefficient AS coefficient,
      Matiere.matiere AS matiere_nom,
      Matiere.id AS matiere_id,
      Classe.id AS classe_id,
      Classe.nom AS classe_nom,
      Trimestre.nom AS trimestre_nom,
      Trimestre.id AS trimestre_id,
      GROUP_CONCAT(DISTINCT IF(Note_inter.id_trimestre = ?, Note_inter.inter, NULL)) AS note_interrogation,
      GROUP_CONCAT(DISTINCT IF(Note_devoir.id_trimestre = ?, Note_devoir.devoir, NULL)) AS note_devoir
    FROM 
      Eleve
    JOIN 
      Classe ON Eleve.id_classe = Classe.id
    JOIN 
      Trimestre ON Trimestre.id = ?
    JOIN 
      Enseignant_Classe ON Classe.id = Enseignant_Classe.id_classe
    JOIN 
      Matiere ON Matiere.id = Enseignant_Classe.id_matiere
    JOIN 
      Enseignant ON Enseignant.id = Enseignant_Classe.id_enseignant
    JOIN
      Coefficient ON Coefficient.id = Matiere.id_coefficient 
    LEFT JOIN 
      Note_inter ON Eleve.id = Note_inter.id_eleve AND Note_inter.id_enseignant = Enseignant.id AND Note_inter.id_matiere = Matiere.id
    LEFT JOIN 
      Note_devoir ON Eleve.id = Note_devoir.id_eleve AND Note_devoir.id_enseignant = Enseignant.id AND Note_devoir.id_matiere = Matiere.id
    WHERE 
      Classe.id = ?
      AND Enseignant.id = ?
      AND Matiere.id = ?
    GROUP BY 
      Eleve.id
  `;

  db.query(sql, [trimestreId, trimestreId, trimestreId, classeId, enseignantId, matiereId], (error, results) => {
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Aucune note trouvée pour ce critère' });
    }
    res.json(results);
  });
});


app.post('/api/save-notes', async (req, res) => {
  const notesToSave = req.body;

  try {
    // Suppression des anciennes notes
    for (const note of notesToSave) {
      // Suppression des notes d'interrogation existantes
      await prisma.note_inter.deleteMany({
        where: {
          id_eleve: parseInt(note.id_eleve),
          id_enseignant: parseInt(note.enseignant_id),
          id_matiere: parseInt(note.matiere_id),
          id_trimestre: parseInt(note.trimestre_id),
        },
      });

      // Suppression des notes de devoir existantes
      await prisma.note_devoir.deleteMany({
        where: {
          id_eleve: parseInt(note.id_eleve),
          id_enseignant: parseInt(note.enseignant_id),
          id_matiere: parseInt(note.matiere_id),
          id_trimestre: parseInt(note.trimestre_id),
        },
      });
      // Suppression des notes de devoir existantes
      await prisma.rang.deleteMany({
        where: {
          id_eleve: parseInt(note.id_eleve),
          id_matiere: parseInt(note.matiere_id),
          id_trimestre: parseInt(note.trimestre_id),
        },
      });
    }

    // Enregistrement des nouvelles notes
    for (const note of notesToSave) {
      // Vérification et enregistrement des notes d'interrogation
      if (note.note_inter1 || note.note_inter2 || note.note_inter3 || note.note_inter4) {
        // Créez une entrée pour chaque note d'interrogation
        if (note.note_inter1) {
          await prisma.note_inter.create({
            data: {
              eleve: { connect: { id: note.id_eleve } },
              enseignant: { connect: { id: parseInt(note.enseignant_id) } },
              matiere: { connect: { id: note.matiere_id } },
              trimestre: { connect: { id: note.trimestre_id } },
              inter: parseFloat(note.note_inter1),
            },
          });
        }
        if (note.note_inter2) {
          await prisma.note_inter.create({
            data: {
              eleve: { connect: { id: note.id_eleve } },
              enseignant: { connect: { id: parseInt(note.enseignant_id) } },
              matiere: { connect: { id: note.matiere_id } },
              trimestre: { connect: { id: note.trimestre_id } },
              inter: parseFloat(note.note_inter2),
            },
          });
        }
        if (note.note_inter3) {
          await prisma.note_inter.create({
            data: {
              eleve: { connect: { id: note.id_eleve } },
              enseignant: { connect: { id: parseInt(note.enseignant_id) } },
              matiere: { connect: { id: note.matiere_id } },
              trimestre: { connect: { id: note.trimestre_id } },
              inter: parseFloat(note.note_inter3),
            },
          });
        }
        if (note.note_inter4) {
          await prisma.note_inter.create({
            data: {
              eleve: { connect: { id: note.id_eleve } },
              enseignant: { connect: { id: parseInt(note.enseignant_id) } },
              matiere: { connect: { id: note.matiere_id } },
              trimestre: { connect: { id: note.trimestre_id } },
              inter: parseFloat(note.note_inter4),
            },
          });
        }
      }

      // Vérification et enregistrement des notes de devoir
      if (note.note_devoir1 || note.note_devoir2) {
        // Créez une entrée pour chaque note de devoir
        if (note.note_devoir1) {
          await prisma.note_devoir.create({
            data: {
              eleve: { connect: { id: note.id_eleve } },
              enseignant: { connect: { id: parseInt(note.enseignant_id) } },
              matiere: { connect: { id: note.matiere_id } },
              trimestre: { connect: { id: note.trimestre_id } },
              devoir: parseFloat(note.note_devoir1),
            },
          });
        }
        if (note.note_devoir2) {
          await prisma.note_devoir.create({
            data: {
              eleve: { connect: { id: note.id_eleve } },
              enseignant: { connect: { id: parseInt(note.enseignant_id) } },
              matiere: { connect: { id: note.matiere_id } },
              trimestre: { connect: { id: note.trimestre_id } },
              devoir: parseFloat(note.note_devoir2),
            },
          });

          await prisma.rang.create({
           data: {
            matiere: { connect: { id: note.matiere_id } },
            trimestre: { connect: { id: note.trimestre_id } },
            eleve: { connect: { id: note.id_eleve } },
            rang: parseInt(note.rang_final),
           } 
          })
        }
      }
    }

    res.status(200).send('Notes enregistrées avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des notes :', error);
    res.status(500).send('Une erreur est survenue lors de l\'enregistrement des notes.');
  } finally {
    await prisma.$disconnect();
  }
});



/**************************************************Administrateur**********************************************/
app.get('/api/admin/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM Admin WHERE id = ?';

  db.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results[0]); 
    }
  });
});

app.get("/api/classes-eleves/", (req, res) => {
  const query =`
                SELECT 
                      Classe.id AS classe_id,
                      Classe.nom AS classe_nom,
                      COUNT(Eleve.id) AS nombre_eleve
                  FROM 
                      Classe
                  LEFT JOIN 
                      Eleve ON Classe.id = Eleve.id_classe
                  GROUP BY 
                      Classe.id, Classe.nom;
                                            `;
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results); // Assuming you want to return the first result
    }
  });
});


app.get("/api/enseignants/", (req, res) => {
  const query =`
                SELECT
                      Enseignant.id AS enseignant_id,
                      Enseignant.nom AS enseignant_nom,
                      Enseignant.prenom AS enseignant_prenom,
                      Enseignant.contact AS enseignant_contact,
                      Enseignant.sexe AS enseignant_sexe
                  FROM 
                      Enseignant

                                            `;
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results); // Assuming you want to return the first result
    }
  });
});


app.get("/api/enseignants-classe/", (req, res) => {
  const query =`
                SELECT 
                      Enseignant_Classe.id AS enseignant_classe_id,
                      Classe.id AS classe_id,
                      Classe.nom AS classe_nom,
                      Enseignant.id AS enseignant_id,
                      Enseignant.nom AS enseignant_nom,
                      Enseignant.prenom AS enseignant_prenom,
                      Enseignant.sexe AS enseignant_sexe
                  FROM 
                      Enseignant_Classe
                  JOIN Enseignant ON Enseignant.id = Enseignant_Classe.id_enseignant
                  JOIN Classe ON Classe.id = Enseignant_Classe.id_classe

                                            `;
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results); // Assuming you want to return the first result
    }
  });
});


app.get('/api/:id/photo', (req, res) => {
  const eleveId = req.params.id;
  const query = `
    SELECT photo FROM Eleve WHERE id = ?
  `;
  db.query(query, [eleveId], (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else if (results.length > 0) {
      const photo = results[0].photo;
      if (photo) {
        res.setHeader('Content-Type', 'image/jpeg'); // Ajustez le type MIME si nécessaire
        res.send(photo);
      } else {
        res.status(404).send('Photo not found');
      }
    } else {
      res.status(404).send('Eleve not found');
    }
  });
});


app.get("/api/classe-eleves/:id", (req, res) => {
  const classeId = req.params.id;
  const query =`
              SELECT
                  Eleve.id AS eleve_id,
                  Eleve.nom AS eleve_nom,
                  Eleve.prenom AS eleve_prenom,
                  Eleve.sexe AS eleve_sexe
                FROM
                  Classe
                JOIN Eleve ON Eleve.id_classe = Classe.id
                WHERE Classe.id = ?
`;
  db.query(query, [classeId], (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      const response = results.map(eleve => ({
        ...eleve,
        photoUrl: `http://localhost:8080/api/${eleve.eleve_id}/photo` // URL de la photo
      }));
      res.json(response); // Assuming you want to return the first result
    }
  });
});

app.get('/api/eleves-classe/:id', (req, res) => {
  const id = req.params.id;
  const query = `
                  SELECT
                        Eleve.nom AS eleve_nom,
                        Eleve.prenom AS eleve_prenom,
                        Eleve.photo AS image
                      FROM
                        Eleve
                      WHERE
                        Eleve.id_classe = ?`;
  db.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.json(results); // Assuming you want to return the first result
    }
  });
});

// Exemple de route pour récupérer les notes d'un élève par matière et trimestre
app.get('/api/student-grades/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    // Récupérer les notes d'interrogation
    const interros = await prisma.note_inter.findMany({
      where: { id_eleve: parseInt(studentId) },
      include: {
        matiere: true,
        trimestre: true
      }
    });

    // Récupérer les notes de devoirs
    const devoirs = await prisma.note_devoir.findMany({
      where: { id_eleve: parseInt(studentId) },
      include: {
        matiere: true,
        trimestre: true
      }
    });

    // Organiser les données
    const gradesData = {};

    // Objets pour stocker les compteurs par matière
    const interroCounters = {};
    const devoirCounters = {};

    // Traiter les notes d'interrogation
    interros.forEach(note => {
      const { matiere, trimestre, inter, id } = note;  // Ajouter l'ID de la note d'interrogation
      if (!gradesData[matiere.id]) {
        gradesData[matiere.id] = { name: matiere.matiere, terms: {} };
        // Initialiser les compteurs pour cette matière
        interroCounters[matiere.id] = 1;
        devoirCounters[matiere.id] = 1;
      }
      if (!gradesData[matiere.id].terms[trimestre.id]) {
        gradesData[matiere.id].terms[trimestre.id] = {};
      }
      // Ajouter la note à l'emplacement approprié avec clé incrémentale pour chaque matière
      gradesData[matiere.id].terms[trimestre.id][`interro${interroCounters[matiere.id]++}`] = { grade: inter, id: id };
    });

    // Traiter les notes de devoirs
    devoirs.forEach(note => {
      const { matiere, trimestre, devoir, id } = note;  // Ajouter l'ID de la note de devoir
      if (!gradesData[matiere.id]) {
        gradesData[matiere.id] = { name: matiere.matiere, terms: {} };
        // Initialiser les compteurs pour cette matière
        interroCounters[matiere.id] = 1;
        devoirCounters[matiere.id] = 1;
      }
      if (!gradesData[matiere.id].terms[trimestre.id]) {
        gradesData[matiere.id].terms[trimestre.id] = {};
      }
      // Ajouter la note à l'emplacement approprié avec clé incrémentale pour chaque matière
      gradesData[matiere.id].terms[trimestre.id][`devoir${devoirCounters[matiere.id]++}`] = { grade: devoir, id: id };
    });

    res.json(gradesData);
  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des notes' });
  }
});


app.get('/api/matieres/', (req, res) => {
  const query = `
    SELECT
  Matiere.id AS matiere_id,
  Matiere.matiere AS matiere_nom,
  Coefficient.coefficient AS matiere_coef
FROM Matiere
LEFT JOIN Coefficient ON Coefficient.id = Matiere.id_coefficient
 
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération de la matière:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Matière non trouvée' });
    }

    // Envoyer les données de la matière en réponse
    res.json(results);
  });
});


app.get('/api/matiere/:matiereId', (req, res) => {
  const { matiereId } = req.params;
  const query = `
    SELECT
      id AS matiere_id,
      matiere AS name
    FROM Matiere
    WHERE id = ?;
  `;

  db.query(query, [matiereId], (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération de la matière:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Matière non trouvée' });
    }

    // Envoyer les données de la matière en réponse
    res.json(results[0]);
  });
});

app.get('/api/trimesters/', (req, res) => {
  const query = `
    SELECT
      id AS trimestre_id,
      nom AS trimestre_nom
    FROM Trimestre
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des trimestres:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Trimestres non trouvée' });
    }

    // Envoyer les données de la matière en réponse
    res.json(results);
  });
});

app.get('/api/parent/:parentId/commentaires', (req, res) => {
  const { parentId } = req.params;
  const query = `
    SELECT 
        e.id AS eleve_id,
        e.nom AS eleve_nom,
        e.prenom AS eleve_prenom,
        c.contenu AS commentaire,
        ens.nom AS enseignant_nom,
        ens.prenom AS enseignant_prenom,
        m.matiere AS matiere_nom,
        t.nom AS trimestre_nom,
        c.createdAt AS date_commentaire
      FROM 
        Eleve e
      JOIN 
        Commentaire c ON e.id = c.id_eleve
      JOIN 
        Enseignant ens ON c.id_enseignant = ens.id
      JOIN 
        Matiere m ON c.id_matiere = m.id
      JOIN 
        Trimestre t ON c.id_trimestre = t.id
      WHERE 
        e.id_parent = ?
  `;

  db.query(query, [parentId], (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des commentaires.', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des commentaires.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Aucun commentaire trouvé pour ce parent.' });
    }

    // Envoyer les données de la matière en réponse
    res.json(results);
  });
});


// Fonction pour générer une chaîne aléatoire
function generateRandomString(length) {
  return crypto.randomBytes(length).toString('hex');
}

app.post('/api/students', async (req, res) => {
  try {
    const { nom, prenom, sexe, id_parent, id_classe } = req.body;

    // Validation de la requête
    if (!nom || !prenom || !sexe || !id_parent || !id_classe) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Générer un username et un mot de passe aléatoires
    const username = generateRandomString(2); // Par exemple, 8 octets en hexadécimal
    const password = generateRandomString(2); // Par exemple, 12 octets en hexadécimal

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Fonction pour lire une image en binaire
  const convertImageToBinary = (imagePath) => {
  const filePath = path.resolve(__dirname, imagePath);
  
    // Vérifiez si le fichier existe avant de tenter de le lire
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    return fs.readFileSync(filePath);
  };
  const photoPath = path.join(__dirname, 'assets/profil.png');
  const photoData = fs.readFileSync(photoPath);
    // Ajout de l'étudiant dans la base de données avec le mot de passe haché
    const newStudent = await prisma.eleve.create({
      data: {
        nom,
        prenom,
        sexe,
        photo: photoData, // Utiliser la données binaires
        id_parent,
        id_classe,
        username,
        password: hashedPassword
      }
    });

    res.status(201).json({ 
      ...newStudent,
      generatedUsername: username,
      generatedPassword: password
    });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'étudiant' });
  }
});

app.post('/api/parent', async (req, res) => {
  try {
    const { nom, prenom, contact } = req.body;

    // Validation de la requête
    if (!nom || !prenom || !contact) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Générer un username et un mot de passe aléatoires
    const username = generateRandomString(2); // Par exemple, 8 octets en hexadécimal
    const password = generateRandomString(2); // Par exemple, 12 octets en hexadécimal

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Fonction pour lire une image en binaire
    const convertImageToBinary = (imagePath) => {
    const filePath = path.resolve(__dirname, imagePath);
    
      // Vérifiez si le fichier existe avant de tenter de le lire
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
  
      return fs.readFileSync(filePath);
    };
    const photoPath = path.join(__dirname, 'assets/profil.png');
    const photoData = fs.readFileSync(photoPath);

    // Ajout du parent dans la base de données avec le mot de passe haché
    const newParent = await prisma.parent.create({
      data: {
        nom,
        prenom,
        contact,
        photo: photoData,
        username,
        password: hashedPassword
      }
    });

    res.status(201).json({ 
      ...newParent,
      generatedUsername: username,
      generatedPassword: password
    });
  } catch (error) {
    console.error('Error adding parent:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du parent' });
  }
});

app.post('/api/enseignants', async (req, res) => {
  try {
    const { nom, prenom, contact, sexe } = req.body;

    // Validation de la requête
    if (!nom || !prenom || !contact || !sexe) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Générer un username et un mot de passe aléatoires
    const username = generateRandomString(2); // Par exemple, 8 octets en hexadécimal
    const password = generateRandomString(2); // Par exemple, 12 octets en hexadécimal

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, saltRounds);

     // Fonction pour lire une image en binaire
  const convertImageToBinary = (imagePath) => {
    const filePath = path.resolve(__dirname, imagePath);
    
      // Vérifiez si le fichier existe avant de tenter de le lire
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
  
      return fs.readFileSync(filePath);
    };
    const photoPath = path.join(__dirname, 'assets/profil.png');
    const photoData = fs.readFileSync(photoPath);

    // Ajout de l'enseignant dans la base de données avec le mot de passe haché
    const newEnseignant = await prisma.enseignant.create({
      data: {
        nom,
        prenom,
        contact,
        sexe,
        photo:photoData,
        username,
        password: hashedPassword
      }
    });

    res.status(201).json({ 
      ...newEnseignant,
      generatedUsername: username,
      generatedPassword: password,
    });
  } catch (error) {
    console.error('Error adding enseignant:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'enseignant' });
  }
});


app.post('/api/matiere', async (req, res) => {
  try {
    const { matiere, coefficientValue } = req.body;

    // Validation de la requête
    if (!matiere || coefficientValue === undefined) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Vérifiez si le coefficient existe déjà
    let coefficient = await prisma.coefficient.findFirst({
      where: { coefficient: parseInt(coefficientValue) },
    });

    // Si le coefficient n'existe pas, créez-le
    if (!coefficient) {
      coefficient = await prisma.coefficient.create({
        data: {
          coefficient: parseInt(coefficientValue),
        },
      });
    }

    const newMatiere = await prisma.matiere.create({
      data: {
        matiere,
        id_coefficient: parseInt(coefficient.id),
      }
    });

    res.status(201).json({ 
      ...newMatiere,
    });
  } catch (error) {
    console.error('Error create new matiere:', error);
    res.status(500).json({ error: 'Erreur lors de la creation d\'une nouvelle matiere.' });
  }
});


app.post('/api/enseignant-classe', async (req, res) => {
  try {
    const { id_enseignant, id_classe, id_matiere } = req.body;

    // Validation de la requête
    if (!id_enseignant || !id_classe || !id_matiere) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    const newEnseignant = await prisma.enseignant_Classe.create({
      data: {
        id_classe,
        id_enseignant,
        id_matiere,
      }
    });

    res.status(201).json({ 
      ...newEnseignant,
    });
  } catch (error) {
    console.error('Error adding enseignant in the class:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'enseignant dans la classe.' });
  }
});

app.post('/api/classes', async (req, res) => {
  try {
    const { nom } = req.body;

    // Validation de la requête
    if (!nom) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Ajout de l'étudiant dans la base de données avec le mot de passe haché
    const newClass = await prisma.classe.create({
      data: {
        nom,
      }
    });

    res.status(201).json({ 
      ...newClass,
    });
  } catch (error) {
    console.error('Error adding class:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la classe' });
  }
});

app.post('/api/commentaire', async (req, res) => {
  try {
    const { id_eleve, id_enseignant, id_matiere, id_trimestre, contenu } = req.body;

    // Validation de la requête
    if (!id_eleve || !id_enseignant || !id_matiere || !id_trimestre || !contenu) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Ajout du commentaire
    const newCommentaire = await prisma.commentaire.create({
      data: {
        id_eleve,
        id_enseignant,
        id_matiere,
        id_trimestre,
        contenu,
      }
    });

    res.status(201).json({ 
      ...newCommentaire,
    });
  } catch (error) {
    console.error('Error adding commentaire:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du commentaire.' });
  }
});

app.post('/api/trimestre', async (req, res) => {
  try {
    const { nom } = req.body;

    // Validation de la requête
    if (!nom) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Ajout du trimestre dans la base de données avec le mot de passe haché
    const newTrimestre = await prisma.trimestre.create({
      data: {
        nom,
      }
    });

    res.status(201).json({ 
      ...newTrimestre,
    });
  } catch (error) {
    console.error('Error adding trimestre:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du trimestre' });
  }
});


// Exemple de route DELETE pour supprimer un élève
app.delete('/api/supprimereleve/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.eleve.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json({ message: 'Élève supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'élève:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'élève.' });
  }
});


app.delete('/api/supprimerparent/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.parent.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json({ message: 'parent supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du parent:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression du parent.' });
  }
});

app.delete('/api/supprimermatiere/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.matiere.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json({ message: 'matiere supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la matiere:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression du matiere.' });
  }
});

app.delete('/api/supprimerenseignant/:id/', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.enseignant_Classe.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json({ message: 'Ensseignant supprimé avec succès de la classe.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'enseignant:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'enseignant de la classe.' });
  }
});

// Exemple de route DELETE pour supprimer une classe
app.delete('/api/supprimerclasse/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.classe.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json({ message: 'Classe supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la classe:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de la classe .' });
  }
});


// Endpoint pour mettre à jour un élève
app.put('/api/miseajoureleve/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, id_classe } = req.body;

  try {
    const updatedEleve = await prisma.eleve.update({
      where: { id: parseInt(id) },
      data: {
        nom,
        prenom,
        id_classe,
      },
    });
    res.json(updatedEleve);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'élève' });
  }
});


// Endpoint pour mettre à jour un parent
app.put('/api/miseajourparent/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, prenom , contact} = req.body;

  try {
    const updatedParent = await prisma.parent.update({
      where: { id: parseInt(id) },
      data: {
        nom,
        prenom,
        contact,
      },
    });
    res.json(updatedParent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du parent' });
  }
});

// Endpoint pour mettre à jour un enseignant
app.put('/api/miseajourenseignant/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, contact, sexe } = req.body;

  try {
    const updatedEnseignant = await prisma.enseignant.update({
      where: { id: parseInt(id) },
      data: {
        nom,
        prenom,
        contact,
        sexe,
      },
    });
    res.json(updatedEnseignant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'enseignant' });
  }
});

app.put('/api/miseajourinter/:subjectId/:term', async (req, res) => {
  const { subjectId, term } = req.params;
  const { interro1, interro2, interro3, interro4 } = req.body;

  try {
    // Mettre à jour chaque note d'interrogation individuellement
    const updates = [];

    if (interro1 && interro1.id) {
      updates.push(
        prisma.note_inter.update({
          where: { id: interro1.id },
          data: { inter: interro1.grade }
        })
      );
    }

    if (interro2 && interro2.id) {
      updates.push(
        prisma.note_inter.update({
          where: { id: interro2.id },
          data: { inter: interro2.grade }
        })
      );
    }

    if (interro3 && interro3.id) {
      updates.push(
        prisma.note_inter.update({
          where: { id: interro3.id },
          data: { inter: interro3.grade }
        })
      );
    }

    if (interro4 && interro4.id) {
      updates.push(
        prisma.note_inter.update({
          where: { id: interro4.id },
          data: { inter: interro4.grade }
        })
      );
    }

    // Exécuter toutes les mises à jour
    await Promise.all(updates);

    res.status(200).json({ message: 'Notes d\'interrogation mises à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des notes d\'interrogation:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour des notes d\'interrogation' });
  }
});

app.put('/api/miseajourdevoir/:subjectId/:term', async (req, res) => {
  const { subjectId, term } = req.params;
  const { devoir1, devoir2 } = req.body;

  try {
    // Mettre à jour chaque note de devoir individuellement
    const updates = [];

    if (devoir1 && devoir1.id) {
      updates.push(
        prisma.note_devoir.update({
          where: { id: devoir1.id },
          data: { devoir: devoir1.grade }
        })
      );
    }

    if (devoir2 && devoir2.id) {
      updates.push(
        prisma.note_devoir.update({
          where: { id: devoir2.id },
          data: { devoir: devoir2.grade }
        })
      );
    }

    // Exécuter toutes les mises à jour
    await Promise.all(updates);

    res.status(200).json({ message: 'Notes de devoir mises à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des notes de devoir:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour des notes de devoir' });
  }
});

app.put('/api/updatePassword/:id', async (req, res) => {
  const { id } = req.params;
  const { Apassword, Npassword, role } = req.body;

  if (!Apassword || !Npassword) {
    return res.status(400).json({ error: 'L\'ancien et le nouveau mot de passe sont requis' });
  }

  try {
    let user;
    // Récupérer l'utilisateur selon son rôle
    if (role === "eleve") {
      user = await prisma.eleve.findUnique({ where: { id: parseInt(id) } });
    } else if (role === "parent") {
      user = await prisma.parent.findUnique({ where: { id: parseInt(id) } });
    } else if (role === "enseignant") {
      user = await prisma.enseignant.findUnique({ where: { id: parseInt(id) } });
    } else if (role === "admin") {
      user = await prisma.admin.findUnique({ where: { id: parseInt(id) } });
    } else {
      return res.status(400).json({ error: 'Rôle invalide' });
    }

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier l'ancien mot de passe
    const isPasswordValid = await bcrypt.compare(Apassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'L\'ancien mot de passe est incorrect' });
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(Npassword, 10);

    // Mettre à jour le mot de passe de l'utilisateur
    if (role === "eleve") {
      const updatedPassword = await prisma.eleve.update({
        where: { id: parseInt(id) },
        data: { password: hashedPassword },
      });
      res.status(200).json(updatedPassword);
    } else if (role === "parent") {
      const updatedPassword = await prisma.parent.update({
        where: { id: parseInt(id) },
        data: { password: hashedPassword },
      });
      res.status(200).json(updatedPassword);
    } else if (role === "enseignant") {
      const updatedPassword = await prisma.enseignant.update({
        where: { id: parseInt(id) },
        data: { password: hashedPassword },
      });
      res.status(200).json(updatedPassword);
    } else if (role === "admin") {
      const updatedPassword = await prisma.admin.update({
        where: { id: parseInt(id) },
        data: { password: hashedPassword },
      });
      res.status(200).json(updatedPassword);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du mot de passe' });
  }
});


app.put('/api/updateUsername/:id', async (req, res) => {
  const { id } = req.params;
  const { NuserName, role, Password } = req.body;

  if (!NuserName || !Password) {
    return res.status(400).json({ error: 'Le mot de passe est requis' });
  }

  try {
    
    let user;
    // Récupérer l'utilisateur selon son rôle
    if (role === "eleve") {
      user = await prisma.eleve.findUnique({ where: { id: parseInt(id) } });
    } else if (role === "parent") {
      user = await prisma.parent.findUnique({ where: { id: parseInt(id) } });
    } else if (role === "enseignant") {
      user = await prisma.enseignant.findUnique({ where: { id: parseInt(id) } });
    } else if (role === "admin") {
      user = await prisma.admin.findUnique({ where: { id: parseInt(id) } });
    } else {
      return res.status(400).json({ error: 'Rôle invalide' });
    }

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier l'ancien mot de passe
    const isPasswordValid = await bcrypt.compare(Password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'L\'ancien mot de passe est incorrect' });
    }

    // Mettre à jour le mot de passe de l'utilisateur
    if (role === "eleve") {
      const updatedUsername = await prisma.eleve.update({
        where: { id: parseInt(id) },
        data: { username: NuserName },
      });
      res.status(200).json(updatedUsername);
    } else if (role === "parent") {
      const updatedUsername = await prisma.parent.update({
        where: { id: parseInt(id) },
        data: { username: NuserName },
      });
      res.status(200).json(updatedUsername);
    } else if (role === "enseignant") {
      const updatedUsername = await prisma.enseignant.update({
        where: { id: parseInt(id) },
        data: { username: NuserName },
      });
      res.status(200).json(updatedUsername);
    } else if (role === "admin") {
      const updatedUsername = await prisma.admin.update({
        where: { id: parseInt(id) },
        data: { username: NuserName },
      });
      res.status(200).json(updatedUsername);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'username.' });
  }
});


/*************************************************Connexion*************************************************/



// Connexion à MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connecté à MySQL');
});


// Endpoint de connexion
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Trouver l'utilisateur (ou parent, enseignant ou admin) dans la base de données
    const user = await prisma.eleve.findUnique({
      where: { username },
    }) || await prisma.parent.findUnique({
      where: { username },
    }) || await prisma.enseignant.findUnique({
      where: { username },
    }) || await prisma.admin.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Générer un token JWT si nécessaire 
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
/***************************************************Admin*************************************************/




// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});













app.post('/api/admin', async (req, res) => {
  try {
    const { nom, prenom, email } = req.body;

    // Validation de la requête
    if (!nom || !prenom || !email) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Générer un username et un mot de passe aléatoires
    const username = generateRandomString(2); // Par exemple, 8 octets en hexadécimal
    const password = generateRandomString(2); // Par exemple, 12 octets en hexadécimal

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Fonction pour lire une image en binaire
  const convertImageToBinary = (imagePath) => {
    const filePath = path.resolve(__dirname, imagePath);
    
      // Vérifiez si le fichier existe avant de tenter de le lire
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
  
      return fs.readFileSync(filePath);
    };
    const photoPath = path.join(__dirname, 'public/00014372.jpg');
    const photoData = fs.readFileSync(photoPath);

    // Ajout de l'enseignant dans la base de données avec le mot de passe haché
    const newEnseignant = await prisma.admin.create({
      data: {
        nom,
        prenom,
        photo: photoData,
        email,
        username,
        password: hashedPassword
      }
    });

    res.status(201).json({ 
      ...newEnseignant,
      generatedUsername: username,
      generatedPassword: password,
    });
  } catch (error) {
    console.error('Error adding enseignant:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'enseignant' });
  }
});