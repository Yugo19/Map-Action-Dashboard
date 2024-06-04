import { RFC_2822 } from 'moment/moment';
import {React, Component} from 'react'
import "../../assets/css/faq.css"

function FAQ() {
    return(
        <div className='body'>
            <div><h2>Questions fréquentes</h2></div>
            <div className='faq-container'>
                <div>
                    <div className="faq-item">
                        <h3>Comment puis-je visualiser les incidents signalés par les citoyens ?</h3>
                        <p>Réponse : Vous pouvez visualiser les incidents signalés par les citoyens dans la section "Incidents" de votre tableau de bord. Tous les incidents signalés seront répertoriés avec leurs détails, leur statut actuel et d'autres informations pertinentes.</p>
                    </div>
                    <div className="faq-item">
                        <h3>Comment puis-je modifier le statut d'un incident signalé ?</h3>
                        <p>Réponse : Pour modifier le statut d'un incident signalé, accédez à la section "Incidents" de votre tableau de bord, puis sélectionnez l'incident que vous souhaitez mettre à jour. Vous trouverez une option pour modifier le statut de l'incident, tel que "En cours", "Résolu" et "pris en compte"</p>
                    </div>
                </div>
                <div>
                    <div className="faq-item">
                        <h3>Comment puis-je collaborer avec une autre organisation?</h3>
                        <p>
                            Réponse : La collaboration se fait uniquement sur les incidents qui sont pris en compte.
                            Dans la section collaboration, cliquez sur l'incident à laquelle vous voulez collaborer,
                            vous serez redirigé sur la page de demande de collaboration là vous verrez toutes
                             les informations relatives à la personne qui a pris cet incident en compte.
                            Cliquez sur Faire une demande de collaboration, et la collaboration sera faite.
                        </p>
                    </div>
                    <div className="faq-item">
                        <h3>Comment marche l'exportation des données?</h3>
                        <p>
                            Réponse : D'abord l'exportation des données concerne les incidents.
                            Les incidents sont exportés par jour, mois ou année. 
                            Choisissez les données du jour, mois ou année que vous voulez exporter en format csv puis cliquez sur exporter.
                            L'exportation est fait vous verrez un fichier en csv qui est en cours de téléchargement, une fois le téléchargement terminé 
                            ouvrez le fichier et vous verrez les données exportées.
                        </p>
                    </div>
                </div>
                
               
                
                
                
            </div>
        </div>
        
    )
    
}
export default FAQ;