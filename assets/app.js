$(function() {
	// Sembunyikan tombol di awal
	$("#btnTop").hide();
	// Munculkan tombol ketika scroll > 200px
	$(window).scroll(function() {
		if ($(this).scrollTop() > 200) {
			$("#btnTop").fadeIn();
		} else {
			$("#btnTop").fadeOut();
		}
	});
	// Langsung lompat ke atas (tanpa animasi)
	$("#btnTop").click(function() {
		$(window).scrollTop(0); // langsung ke posisi 0
		return false;
	});

	// Aktifkan Parsley Validation di semua form
	if (typeof $.fn.parsley !== 'undefined') {
		$('form').each(function() {
			$(this).parsley();
		});
	} else {
		console.warn("Parsley.js belum dimuat!");
	}
	// Tambahkan tanda * pada field required
	$('input[required], select[required], textarea[required]').each(function() {
		let id = $(this).attr('id');
		if (id) {
			// Cari label berdasarkan atribut for="id"
			let $label = $('label[for="' + id + '"]');
			if ($label.length && $label.find('.text-danger').length === 0) {
				$label.append(' <span class="text-danger">*</span>');
			}
		} else {
			// Jika tidak punya ID, cari label terdekat di parent .mb-3 atau .form-group
			let $label = $(this).closest('.mb-3, .form-group').find('label').first();
			if ($label.length && $label.find('.text-danger').length === 0) {
				$label.append(' <span class="text-danger">*</span>');
			}
		}
	});
	// Re-inisialisasi Parsley untuk form di dalam modal
	$(document).on('shown.bs.modal', function(e) {
		const $modal = $(e.target);
		const $forms = $modal.find('form');
		$forms.each(function() {
			// Jika belum ada instance Parsley, aktifkan
			if (!$(this).data('Parsley')) {
				$(this).parsley();
				console.log("Parsley aktif untuk form di modal:", this.id || this.name);
			}
		});
	});

	// Rotate icon parent menu
	$('[data-bs-toggle="collapse"]').each(function() {
		let $link = $(this);
		let target = $link.attr('href') || $link.data('bs-target');
		let $icon = $link.find('.rotate-icon');
		if ($(target).hasClass('show')) {
			$icon.addClass('rotate');
		}
		$(target).on('show.bs.collapse', function() {
			$icon.addClass('rotate');
		});
		$(target).on('hide.bs.collapse', function() {
			$icon.removeClass('rotate');
		});
	});

	// Highlight jika URL mengandung #row-...
	let hash = window.location.hash;
	if (hash.startsWith('#row-')) {
		let id = hash.replace('#row-', '');
		let $targetRow = $('#row-' + id);
		if ($targetRow.length) {
			// Animasi scroll
			$('html, body').animate({
				scrollTop: $targetRow.offset().top - 120
			}, 600);
			// Tambah class highlight
			$targetRow.addClass('highlighted');
			// Hapus setelah 3 detik
			setTimeout(() => {
				$targetRow.removeClass('highlighted');
			}, 3000);
		}
	}

	// Saat modal akan ditampilkan
	$('#global-modal').on('show.bs.modal', function(e) {
		var button = $(e.relatedTarget);
		var url = button.attr('href');
		var modal = $(this);
		modal.find('.modal-content').html('<div class="text-center text-muted py-5">Memuat...</div>');
		// Load seluruh isi modal (bisa header/body/footer)
		modal.find('.modal-content').load(url, function(response, status) {
			if (status === "error") {
				modal.find('.modal-content').html('<div class="text-danger p-3">Gagal memuat konten.</div>');
			}
		});
	});
	// Bersihkan isi saat modal ditutup
	$('#global-modal').on('hidden.bs.modal', function() {
		$(this).find('.modal-content').html('');
	});

});