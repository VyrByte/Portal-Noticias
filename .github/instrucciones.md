# Instrucciones de Ingeniería: Estándares de Calidad, Git y Documentación

> **Propósito:** Este documento define las normas obligatorias para la interacción, gestión de cambios y documentación de código. El objetivo es mantener un historial técnico profesional, atómico y autodocumentado.

---

## 1. Gestión de Versiones (Git)

**Filosofía:** Cada commit debe ser una unidad de trabajo atómica. El historial debe ser legible, profesional y reflejar cambios terminados.

### 1.1 Estructura del Mensaje
- **Formato:** `type(scope): Resumen`
- **Idiomas:**
  - El `type` y el `scope` deben escribirse en **Inglés**.
  - El **Resumen** debe escribirse estrictamente en **Español**.

### 1.2 Reglas del Resumen (Línea Principal)
- **Capitalización:** Iniciar siempre con Mayúscula.
- **Longitud:** Máximo 50 caracteres.
- **Sin Verbos Infinitivos:** Prohibido usar "Agregar", "Cambiar", "Arreglar", "Update", etc.
- **Estado de la Acción:** Usar participios o descripciones que indiquen qué se completó o qué estado alcanzó el archivo.
  - ✅ **Correcto:** `feat(auth): Implementado el flujo de validación de tokens`
  - ✅ **Correcto:** `fix(db): Corregida la fuga de memoria en la conexión pool`
  - ✅ **Correcto:** `docs(api): Actualizada la documentación de los endpoints de usuario`
  - ❌ **Incorrecto:** `feat(ui): Agrega botones al home` (Uso de infinitivo)
  - ❌ **Incorrecto:** `fix(logic): Cambio en la validación` (Vago)

### 1.3 Atomicidad Estricta
- **Regla de Oro:** **SOLO UN (1) ARCHIVO POR COMMIT.**
- Si una tarea requiere modificar múltiples archivos, se deben generar commits individuales para cada uno, explicando el cambio específico realizado en ese archivo en particular.
- Quedan prohibidos los commits masivos (`git add .`) que mezclen responsabilidades.

### 1.4 Verificación de Repositorio
- Antes de proponer o ejecutar un commit, se debe verificar el directorio de trabajo para asegurar que se está operando en el repositorio correcto (especialmente en entornos de microservicios o monorepos).

---

## 2. Estándares de Documentación

**Filosofía:** El código debe ser limpio, pero la lógica compleja debe ser explicada para humanos. Documentamos el **porqué**, no el **qué**.

#### Regla de oro: Siempre seguiremos las mejores prácticas de programación. Siempre buena organización, estructuras humanamente legibles y modularización. No se permite escribir código "sucio" para luego documentarlo, ni usar la documentación como excusa para no escribir código claro. Además, se espera que el código sea lo suficientemente claro para no necesitar comentarios, pero si la lógica es compleja o responde a una regla de negocio, entonces se debe documentar.

### 2.1 Idioma y Estilo
- **Idioma:** Todos los comentarios, bloques de documentación (JSDoc, Docstrings, etc.) y explicaciones técnicas deben estar en **Español**.
- **Enfoque:** Explicar la intención de negocio o la lógica técnica detrás de la implementación.

### 2.2 Bloques de Documentación
Toda función, clase o módulo debe incluir un bloque de documentación estructurado según el lenguaje utilizado:
- **Descripción:** Qué hace y por qué existe.
- **Parámetros:** Definición clara de entradas.
- **Retorno:** Qué resultado entrega.

*Ejemplo de estructura:*
```text
/**
 * [Descripción de la lógica de negocio o técnica]
 * @param {tipo} nombre - Definición del parámetro.
 * @returns {tipo} Definición de lo que devuelve.
 */
```

### 2.3 Lógica Interna
- No comentar lo obvio (ej. `i++ // incrementa i`).
- Solo se permite documentar lógica interna si es extremadamente compleja o responde a una regla de negocio no evidente.
- **Código Muerto:** No se comenta código para "guardarlo". Si no se usa, se elimina.

---

## 3. Protocolo de Interacción con el Usuario

### 3.1 Validación de Reglas
- Si el usuario solicita realizar un cambio o un commit que viole estas reglas (ej. un commit con 5 archivos o un mensaje en infinitivo), el asistente **debe advertirle primero**.
- Se debe sugerir la estructura correcta basada en este manual antes de proceder con la ejecución.

### 3.2 Calidad de Respuesta
- Al generar código, este debe seguir las mejores prácticas de limpieza (Clean Code).
- Siempre priorizar la legibilidad y la modularización.

---