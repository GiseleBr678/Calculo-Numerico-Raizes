// Function to handle method selection change
document.getElementById('method-select').addEventListener('change', function() {
    var selectedMethod = this.value;
    var tableHeaders = document.getElementById('result-table').querySelectorAll('th');
    var rangeAInput = document.getElementById('range-a');
    var rangeBInput = document.getElementById('range-b');
    var aLabel = document.querySelector('label[for="range-a"]');
    var bLabel = document.querySelector('label[for="range-b"]');

    // Reset table headers to default
    tableHeaders[0].textContent = 'Iteração';
    tableHeaders[1].textContent = 'a';
    tableHeaders[2].textContent = 'b';
    tableHeaders[3].textContent = 'x';
    tableHeaders[4].textContent = 'f(a)';
    tableHeaders[5].textContent = 'f(b)';
    tableHeaders[6].textContent = 'f(x)';
    tableHeaders[7].textContent = '|b - a|';

    // Adjust table headers and input visibility based on selected method
    if (selectedMethod === 'newton' || selectedMethod === 'secant') {
        // Change table headers
        tableHeaders[1].textContent = 'x'; // Change 'a' to 'x'
        tableHeaders[2].textContent = 'f(x)'; // Change 'b' to 'f(x)'
        tableHeaders[3].textContent = '|x_k+1 - x|'; // Change 'x' to '|x_k+1 - x|'

        // Hide range-a and range-b inputs and labels
        rangeAInput.style.display = 'none';
        rangeBInput.style.display = 'none';
        aLabel.style.display = 'none';
        bLabel.style.display = 'none';
    } else {
        // Show range-a and range-b inputs and labels for other methods
        rangeAInput.style.display = '';
        rangeBInput.style.display = '';
        aLabel.style.display = '';
        bLabel.style.display = '';

        // Show 'a' and 'b' in table headers
        tableHeaders[1].textContent = 'a';
        tableHeaders[2].textContent = 'b';
    }
});


// Function to handle method selection change
document.getElementById('method-select').addEventListener('change', function() {
    var selectedMethod = this.value;
    var tableHeaders = document.getElementById('result-table').querySelectorAll('th');

    // Reset table headers to default
    tableHeaders[0].textContent = 'Iteração';
    tableHeaders[1].textContent = 'a';
    tableHeaders[2].textContent = 'b';
    tableHeaders[3].textContent = 'x';
    tableHeaders[4].textContent = 'f(a)';
    tableHeaders[5].textContent = 'f(b)';
    tableHeaders[6].textContent = 'f(x)';
    tableHeaders[7].textContent = '|b - a|';

    // Adjust table headers based on selected method
    console.log(selectedMethod)
    if (selectedMethod === 'newton') {
        tableHeaders[1].textContent = 'x'; // Change 'a' to 'x'
        tableHeaders[2].textContent = 'f(x)'; // Change 'b' to 'f(x)'
        tableHeaders[3].textContent = '|x_k+1 - x|'; // Change 'x' to '|x_k+1 - x|'
        tableHeaders[4].style.display = 'none'; // Hide 'f(a)' column
        tableHeaders[5].style.display = 'none'; // Hide 'f(b)' column
        tableHeaders[6].style.display = 'none'; // Hide 'f(x)' column
        tableHeaders[7].style.display = 'none'; // Hide '|b - a|' column
    } else {
        tableHeaders[4].style.display = ''; // Show 'f(a)' column
        tableHeaders[5].style.display = ''; // Show 'f(b)' column
        tableHeaders[6].style.display = ''; // Show 'f(x)' column
        tableHeaders[7].style.display = ''; // Show '|b - a|' column'
    }
});


// Function to evaluate the user input function, including derivatives
function evaluateFunction(expression, x) { // expression str and x is a number
    const scope = {
        x: x,
        e: Math.exp(1),
        pi: Math.PI
    };

    // Replace derivative notation with evaluated derivative
    expression = expression.replace(/d\/dx\(([^)]+)\)/g, (_, innerExpr) => {
        return math.derivative(innerExpr, 'x').toString();
    });

    return math.evaluate(expression, scope);
}

// Plot the function
function plotFunction() {
    const funcInput = document.getElementById('function-input').value;
    if (!funcInput) {
        alert("Please enter a function.");
        return;
    }

    const xValues = [];
    const yValues = [];
    for (let x = -4; x <= 4; x += 0.01) {
        xValues.push(x);
        yValues.push(evaluateFunction(funcInput, x));
    }

    const trace = {
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: 'f(x)',
        line: { shape: 'spline' }
    };

    const data = [trace];

    const layout = {
        title: `Graph of f(x) = ${funcInput}`,
        xaxis: { title: 'x' },
        yaxis: { title: 'f(x)' }
    };

    Plotly.newPlot('graph', data, layout);

    // Clear previous results
    document.getElementById('solution').textContent = '';
    document.getElementById('iterations').textContent = '';
    const tableBody = document.getElementById('result-table').getElementsByTagName('tbody')[0];
    while (tableBody.rows.length) {
        tableBody.deleteRow(0);
    }
}

// function tvm(fa, fb) {

// }


// Use default function
function useDefaultFunction() {
    document.getElementById('function-input').value = "x*log10(x)-1";
    plotFunction();
}

// Generate a random function
function generateRandomFunction() {
    const terms = [
        "x",
        "x^2",
        "x^3",
        "cos(x)",
        "sin(x)",
        "tan(x)",
        "exp(x)",
        "log10(x)"
    ];
    let func = "";
    const numTerms = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < numTerms; i++) {
        const coeff = (Math.random() * 10 - 5).toFixed(2);
        const term = terms[Math.floor(Math.random() * terms.length)];
        func += `${coeff}*${term} + `;
    }
    return func.slice(0, -3); // Remove trailing ' + '
}

// Use random function
function useRandomFunction() {
    const randomFunc = generateRandomFunction();
    document.getElementById('function-input').value = randomFunc;
    plotFunction();
}

// Bisection method implementation
function bisection(a, b, f, epsilon) {
    let iterations = 0;
    const table = document.getElementById('result-table').getElementsByTagName('tbody')[0];

    while (true) {
        if (iterations > 100) {
            alert('Could not converge')
            return
        }
        const x = (a + b) / 2; // the middle between a and b (bisection method works like that)
        const fa = f(a);
        const fb = f(b);
        const fx = f(x);
        const row = table.insertRow();
        row.insertCell(0).textContent = iterations + 1;
        row.insertCell(1).textContent = a.toFixed(6);
        row.insertCell(2).textContent = b.toFixed(6);
        row.insertCell(3).textContent = x.toFixed(6);
        try {
            row.insertCell(4).textContent = fa.toFixed(6);
        } catch (e) {
            if (e instanceof TypeError) {
                alert('O valor de a não existe no domínio da função');
                return;
            }
            throw e;
        }
        try {
            row.insertCell(5).textContent = fb.toFixed(6);
        } catch (e) {
            if (e instanceof TypeError) {
                alert('O valor de b não existe no domínio da função');
                return;
            }
            throw e;
        }
        row.insertCell(6).textContent = fx.toFixed(6);
        row.insertCell(7).textContent = Math.abs(b - a).toFixed(6);

        if (fa * fx < 0) { // TVM
            b = x;
        } else {
            a = x;
        }

        iterations++;
        if (Math.abs(fx) < epsilon || Math.abs(b - a) < epsilon) {
            row.cells[3].style.backgroundColor = '#78fa9f';
            return { raiz: x, iterations: iterations };
        }
    }
}

// False Position method implementation
function false_pos(a, b, f, epsilon) {
    let iterations = 0;
    const table = document.getElementById('result-table').getElementsByTagName('tbody')[0];

    while (true) {
        if (iterations > 100) {
            alert('Could not converge')
            return
        }
        const fa = f(a);
        const fb = f(b);
        const x = (a * Math.abs(fb) + b * Math.abs(fa)) / (Math.abs(fb) + Math.abs(fa));
        // const x = ((a * fb) - (b * fa)) / (fb - fa);
        const fx = f(x);

        const row = table.insertRow();
        row.insertCell(0).textContent = iterations + 1;
        row.insertCell(1).textContent = a.toFixed(6);
        row.insertCell(2).textContent = b.toFixed(6);
        row.insertCell(3).textContent = x.toFixed(6);
        try {
            row.insertCell(4).textContent = fa.toFixed(6);
        } catch (e) {
            if (e instanceof TypeError) {
                alert('O valor de a não existe no domínio da função');
                return;
            }
            throw e;
        }
        try {
            row.insertCell(5).textContent = fb.toFixed(6);
        } catch (e) {
            if (e instanceof TypeError) {
                alert('O valor de b não existe no domínio da função');
                return;
            }
            throw e;
        }
        row.insertCell(6).textContent = fx.toFixed(6);
        row.insertCell(7).textContent = Math.abs(b - a).toFixed(6);

        if (fa * fx < 0) { // TVM
            b = x;
        } else {
            a = x;
        }

        iterations++;
        if (Math.abs(fx) < epsilon || Math.abs(b - a) < epsilon) {
            row.cells[3].style.backgroundColor = '#78fa9f';
            return { raiz: x, iterations: iterations };
        }
    }
}

// Newton's method implementation
function newton(x, f_s, f, symbol, epsilon) {
    const fi = math.derivative(f_s, symbol).toString(); // only accepts str and the symbol is the var (x)
    const table = document.getElementById('result-table').getElementsByTagName('tbody')[0];
    let iterations = 0;

    while (true) {
        if (iterations > 100) {
            alert('Could not converge')
            return
        }
        const fx = f(x);
        const aux = x - fx / math.evaluate(fi, { x: x });

        const row = table.insertRow();
        row.insertCell(0).textContent = iterations + 1;
        row.insertCell(1).textContent = x.toFixed(6);
        row.insertCell(2).textContent = f(x).toFixed(6);
        row.insertCell(3).textContent = Math.abs(aux - x).toFixed(6);

        iterations++;

        if (Math.abs(fx) < epsilon || Math.abs(aux - x) < epsilon) {
            row.cells[1].style.backgroundColor = '#78fa9f';
            return { raiz: x, iterations: iterations };
        }
        x = aux;
    }
}

// Secant method implementation
function secant(a, b, f, epsilon) {
    let iterations = 0;
    const table = document.getElementById('result-table').getElementsByTagName('tbody')[0];

    while (true) {
        if (iterations > 100) {
            alert('Could not converge')
            return
        }
        const fa = f(a);
        const fb = f(b);
        const x = b - (fb * (a - b)) / (fa - fb);

        const row = table.insertRow();
        row.insertCell(0).textContent = iterations + 1;
        row.insertCell(1).textContent = a.toFixed(6);
        row.insertCell(2).textContent = b.toFixed(6);
        row.insertCell(3).textContent = x.toFixed(6);
        try {
            row.insertCell(4).textContent = fa.toFixed(6);
        } catch (e) {
            if (e instanceof TypeError) {
                alert('O valor de a não existe no domínio da função');
                return;
            }
            throw e;
        }
        try {
            row.insertCell(5).textContent = fb.toFixed(6);
        } catch (e) {
            if (e instanceof TypeError) {
                alert('O valor de b não existe no domínio da função');
                return;
            }
            throw e;
        }
        row.insertCell(6).textContent = f(x).toFixed(6);
        row.insertCell(7).textContent = Math.abs(b - a).toFixed(6);

        iterations++;

        if (Math.abs(f(x)) < epsilon) {
            row.cells[3].style.backgroundColor = '#78fa9f';
            return { raiz: x, iterations: iterations };
        }

        a = b;
        b = x;
    }
}

// Function to solve the selected method
function solveMethod() {
    const method = document.getElementById('method-select').value;
    const funcInput = document.getElementById('function-input').value;
    const a = parseFloat(document.getElementById('range-a').value);
    const b = parseFloat(document.getElementById('range-b').value);
    const epsilon = parseFloat(document.getElementById('epsilon').value);

    if (!funcInput) {
        alert("Please enter a function.");
        return;
    }

    plotFunction();

    let result;
    switch (method) {
        case 'bisection':
            result = bisection(a, b, x => evaluateFunction(funcInput, x), epsilon);
            break;
        case 'false_pos':
            result = false_pos(a, b, x => evaluateFunction(funcInput, x), epsilon);
            break;
        case 'newton':
            result = newton(a, math.parse(funcInput).toString(), x => evaluateFunction(funcInput, x), 'x', epsilon);
            break;
        case 'secant':
            result = secant(a, b, x => evaluateFunction(funcInput, x), epsilon);
            break;
        default:
            alert("Invalid method selection.");
            return;
    }
    console.log(result)
    document.getElementById('solution').textContent = `Solução: ${result.raiz.toFixed(6)}`;
    document.getElementById('iterations').textContent = `Iterações: ${result.iterations}`;
}
