(function() {
    function fillInfo(info) {
        var html = '';
        for (var attr in info) {
            html += '<tr>';
            html += '<td>' + attr + ':</td>';
            html += '<td><input type="text" id="attr-' + attr + '"/></td>';
            html += '</tr>';
        }
        $('#profile').html(html);

        for (var attr in info) {
            $('#attr-' + attr).val(info[attr]);
            $('#attr-' + attr).on('input', function() {
                if (!$('#save').is(':visible')) {
                    $('#save').slideDown();
                }
            });
        }
    }

    if (localCache.encrypted) {
        $('userID').val(localCache.encrypted.userId);
    }

    $('#userID').change(function() {
        retrieveEncrypted($('#userID').val(), function() {});
    });
    $('#password').on('input', function() {
        var decrypted = decrypt($('#password').val(), localCache.encrypted);
        if (decrypted) {
            fillInfo(decrypted);
        }
    });

    $('#save').on('click', function() {
        $('#save').slideUp();
        var postInfo = {};
        $('#profile').find(':input').each(function(i, el) {
            var id = $(el).attr('id');
            var attr = id.substring('attr-'.length);
            postInfo[attr] = $(el).val();
        });
        update($('#userID').val(), $('#password').val(), postInfo);
    });

    $('#userID').focus();
})();
