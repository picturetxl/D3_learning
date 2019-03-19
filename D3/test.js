function dsv(delimiter, input, init, row) {
    if (arguments.length === 3 && typeof init === "function") row = init, init = undefined;
    var format = dsvFormat(delimiter);
    return text(input, init).then(function (response) {
        return format.parse(response, row);
    });
}


function dsvFormat(delimiter) {
    var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
        DELIMITER = delimiter.charCodeAt(0);

    function parse(text, f) {
        var convert, columns, rows = parseRows(text, function (row, i) {
            if (convert) return convert(row, i - 1);
            columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
        });
        rows.columns = columns || [];
        return rows;
    }
    function parseRows(text, f) {
        var rows = [], // output rows
            N = text.length,
            I = 0, // current character index
            n = 0, // current line number
            t, // current token
            eof = N <= 0, // current token followed by EOF?
            eol = false; // current token followed by EOL?

        // Strip the trailing newline.
        if (text.charCodeAt(N - 1) === NEWLINE)--N;
        if (text.charCodeAt(N - 1) === RETURN)--N;

        function token() {
            if (eof) return EOF;
            if (eol) return eol = false, EOL;

            // Unescape quotes.
            var i, j = I, c;
            if (text.charCodeAt(j) === QUOTE) {
                while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
                if ((i = I) >= N) eof = true;
                else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
                else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE)++I; }
                return text.slice(j + 1, i - 1).replace(/""/g, "\"");
            }

            // Find next delimiter or newline.
            while (I < N) {
                if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
                else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE)++I; }
                else if (c !== DELIMITER) continue;
                return text.slice(j, i);
            }

            // Return last token before EOF.
            return eof = true, text.slice(j, N);
        }

        while ((t = token()) !== EOF) {
            var row = [];
            while (t !== EOL && t !== EOF) row.push(t), t = token();
            if (f && (row = f(row, n++)) == null) continue;
            rows.push(row);
        }

        return rows;
    }

    function preformatBody(rows, columns) {
        return rows.map(function (row) {
            return columns.map(function (column) {
                return formatValue(row[column]);
            }).join(delimiter);
        });
    }

    function format(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
    }

    function formatBody(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return preformatBody(rows, columns).join("\n");
    }

    function formatRows(rows) {
        return rows.map(formatRow).join("\n");
    }

    function formatRow(row) {
        return row.map(formatValue).join(delimiter);
    }

    function formatValue(value) {
        return value == null ? ""
            : value instanceof Date ? formatDate(value)
                : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\""
                    : value;
    }

    return {
        parse: parse,
        parseRows: parseRows,
        format: format,
        formatBody: formatBody,
        formatRows: formatRows
    };
}


function text(input, init) {
    return fetch(input, init).then(responseText);
  }
  
  