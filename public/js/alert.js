// Animation en jquery pour faire disparaître les alert
window.setTimeout(function () {
  $(".alert")
    .fadeTo(500, 0)
    .slideUp(500, function () {
      $(this).remove();
    });
}, 5000);

// Alerte validation lors d'une suppression avec SweetAlert
const alerte = document.querySelectorAll(".formDelete");

// Boucle pour récupérer les éléments de la Node List si plusieurs boutons supprimer dans une même page
for (let i = 0; i < alerte.length; i++) {
  alerte[i].addEventListener("submit", function (event) {
    // Annulation de l'envoi du formulaire côté serveur et attente du choix de l'utilisateur
    event.preventDefault();

    const deleteSwal = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    deleteSwal
      .fire({
        title: "Etes-vous sur de vouloir supprimer ?",
        text: "Vous ne pourrez pas revenir en arrière !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui,supprimer",
        cancelButtonText: "Non, ne pas supprimer",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteSwal.fire("Supprimé !", "Suppression effectuée.", "success");

          // Envoi du formulaire en cas de confirmation par l'utilisateur
          alerte[i].submit();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          deleteSwal.fire(
            "Suppression annulée",
            "C'est pas passé loin !",
            "error"
          );
        }
        event.preventDefault();
      });
  });
}
