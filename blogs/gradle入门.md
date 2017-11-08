# gradle

```gradle

task hello {
	doLast {
		println 'Hello world!'
	}
}
task hello2 << {
	println 'Hello world!'
}

task upper << {
    String someString = 'WangShiChao'
    println "Original: " + someString
    println "Upper case: " + someString.toUpperCase()
}

task count << {
    4.times { print "$it " }
}

/**
* depensOn : the order of task doesnt matter
*/
task intro(dependsOn: hello) << {
    println "I'm Gradle"
}

/**
* dynamic tasks => task0, task1, task2, task3
* the order of task matters
*/

4.times { counter ->
    task "task$counter" << {
        println "I'm task number $counter"
    }
}

task0.dependsOn task2, task3

//doFirst 是倒序执行的，写在最后的最先执行；doLast是顺序执行，写在最前面的最先执行
hello.doFirst {
    println 'Hello First'
}
hello.doLast {
    println "Greetings from the $hello.name task."
}
// << 操作符是 doLast 的简单别称
hello << {
    println 'Hello Last2'
}

// 给任务加入自定义属性
task myTask {
    ext.myProperty = "myValue"
}

task printTaskProperties << {
    println myTask.myProperty
}

// 使用 AntBuilder 来执行 ant.loadfile 任务
// task loadfile << {
//     def files = file('./antLoadfileResources').listFiles().sort()
//     files.each { File file ->
//         if (file.isFile()) {
//             ant.loadfile(srcFile: file, property: file.name)
//             println " *** $file.name ***"
//             println "${ant.properties[file.name]}"
//         }
//     }
// }

task checksum << {
    fileList('./antLoadfileResources').each {File file ->
        ant.checksum(file: file, property: "cs_$file.name")
        println "$file.name Checksum: ${ant.properties["cs_$file.name"]}"
    }
}

task loadfile << {
    fileList('./antLoadfileResources').each {File file ->
        ant.loadfile(srcFile: file, property: file.name)
        println "I'm fond of $file.name"
    }
}

File[] fileList(String dir) {
    file(dir).listFiles({file -> file.isFile() } as FileFilter).sort()
}

// default Tasks
defaultTasks 'clean', 'run'

task clean << {
    println 'Default Cleaning!'
}

task run << {
    println 'Default Running!'
}

// 
task distribution << {
    println "We build the zip with version=$version"
}

task release(dependsOn: 'distribution') << {
    println 'We release now'
}
// hooks
gradle.taskGraph.whenReady {taskGraph ->
    if (taskGraph.hasTask(release)) {
        version = '1.0'
    } else {
        version = '1.0-SNAPSHOT'
    }
}
```

