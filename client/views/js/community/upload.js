function editor() {
  $(document).ready(function() {
    $('#summernote').summernote({
      placeholder: "내용을 입력하세요.",
      height: 500,
      width: 850
    });
  });
}
